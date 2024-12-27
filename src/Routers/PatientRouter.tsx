import careConfig from "@careConfig";
import { useQuery } from "@tanstack/react-query";
import { usePath, useRoutes } from "raviger";
import { createContext, useEffect, useState } from "react";

import ErrorBoundary from "@/components/Common/ErrorBoundary";
import {
  PatientDesktopSidebar,
  PatientMobileSidebar,
  SIDEBAR_SHRINK_PREFERENCE_KEY,
} from "@/components/Common/Sidebar/PatientSidebar";
import { SidebarShrinkContext } from "@/components/Common/Sidebar/Sidebar";
import ErrorPage from "@/components/ErrorPages/DefaultErrorPage";

import { CarePatientTokenKey } from "@/common/constants";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { AppointmentSuccess } from "@/pages/Appoinments/Success";
import { AppointmentPatient } from "@/pages/Patient/Utils";
import PatientHome from "@/pages/Patient/index";
import { TokenData } from "@/types/auth/otpToken";

import SessionRouter from "./SessionRouter";

const PatientRoutes = {
  "/facility/:facilityId/appointments/:appointmentId/success": ({
    appointmentId,
  }: {
    appointmentId: string;
  }) => <AppointmentSuccess appointmentId={appointmentId} />,
  "/patient/home": () => <PatientHome />,
};

const tokenData: TokenData = JSON.parse(
  localStorage.getItem(CarePatientTokenKey) || "{}",
);

export const PatientUserContext = createContext<{
  patients?: AppointmentPatient[];
  selectedPatient: AppointmentPatient | null;
  setSelectedPatient: (patient: AppointmentPatient) => void;
  tokenData: TokenData;
}>({
  patients: undefined,
  selectedPatient: null,
  setSelectedPatient: () => {},
  tokenData: tokenData,
});

export default function PatientRouter() {
  const pages = useRoutes(PatientRoutes);

  const path = usePath();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<AppointmentPatient[]>([]);
  const [selectedPatient, setSelectedPatient] =
    useState<AppointmentPatient | null>(null);

  const { data: userData } = useQuery({
    queryKey: ["patients", tokenData.phoneNumber],
    queryFn: query(routes.otp.getPatient, {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    }),
    enabled: !!tokenData.token,
  });

  useEffect(() => {
    if (userData) {
      setPatients(userData.results);
      const localPatient: AppointmentPatient | undefined = JSON.parse(
        localStorage.getItem("selectedPatient") || "{}",
      );
      const selectedPatient =
        userData.results.find((patient) => patient.id === localPatient?.id) ||
        userData.results[0];
      setSelectedPatient(selectedPatient);
      localStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
    }
  }, [userData]);

  useEffect(() => {
    setSidebarOpen(false);
    const pageContainer = window.document.getElementById("pages");
    pageContainer?.scroll(0, 0);
  }, [path]);

  const [shrinked, setShrinked] = useState(
    localStorage.getItem(SIDEBAR_SHRINK_PREFERENCE_KEY) === "true",
  );

  useEffect(() => {
    localStorage.setItem(
      SIDEBAR_SHRINK_PREFERENCE_KEY,
      shrinked ? "true" : "false",
    );
  }, [shrinked]);

  if (!pages) {
    return <SessionRouter />;
  }

  return (
    <PatientUserContext.Provider
      value={{
        patients,
        selectedPatient,
        setSelectedPatient,
        tokenData,
      }}
    >
      <SidebarShrinkContext.Provider value={{ shrinked, setShrinked }}>
        <div className="flex h-screen overflow-hidden bg-secondary-100 print:overflow-visible">
          <>
            <div className="block md:hidden">
              <PatientMobileSidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
              />{" "}
            </div>
            <div className="hidden md:block">
              <PatientDesktopSidebar />
            </div>
          </>

          <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-gray-100 print:overflow-visible">
            <div className="relative z-10 flex h-16 shrink-0 bg-white shadow md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="border-r border-secondary-200 px-4 text-secondary-500 focus:bg-secondary-100 focus:text-secondary-600 focus:outline-none md:hidden"
                aria-label="Open sidebar"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
              <a
                href="/"
                className="flex h-full w-full items-center px-4 md:hidden"
              >
                <img
                  className="h-8 w-auto"
                  src={careConfig.mainLogo?.dark}
                  alt="care logo"
                />
              </a>
            </div>

            <main
              id="pages"
              className="flex-1 overflow-y-auto bg-gray-100 focus:outline-none md:pb-2 md:pr-2"
            >
              <div
                className="max-w-8xl mx-auto mt-4 min-h-[96vh] rounded-lg border bg-gray-50 p-3 shadow"
                data-cui-page
              >
                <ErrorBoundary
                  fallback={<ErrorPage forError="PAGE_LOAD_ERROR" />}
                >
                  {pages}
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </div>
      </SidebarShrinkContext.Provider>
    </PatientUserContext.Provider>
  );
}
