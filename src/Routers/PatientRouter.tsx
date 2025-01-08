import careConfig from "@careConfig";
import { useRoutes } from "raviger";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, SidebarFor } from "@/components/ui/sidebar/app-sidebar";

import ErrorBoundary from "@/components/Common/ErrorBoundary";
import ErrorPage from "@/components/ErrorPages/DefaultErrorPage";
import { patientTabs } from "@/components/Patient/PatientDetailsTab";
import { PatientHome } from "@/components/Patient/PatientHome";

import PatientUserProvider from "@/Providers/PatientUserProvider";
import { PatientRegistration } from "@/pages/Appoinments/PatientRegistration";
import PatientSelect from "@/pages/Appoinments/PatientSelect";
import { ScheduleAppointment } from "@/pages/Appoinments/Schedule";
import { AppointmentSuccess } from "@/pages/Appoinments/Success";
import { FacilitiesPage } from "@/pages/Facility/FacilitiesPage";
import PatientIndex from "@/pages/Patient/index";

import PublicRouter from "./PublicRouter";

const DashboardRoutes = {
  "/nearby_facilities": () => <FacilitiesPage />,
  "/facility/:facilityId/appointments/:appointmentId/success": ({
    appointmentId,
  }: {
    appointmentId: string;
  }) => <AppointmentSuccess appointmentId={appointmentId} />,
  "/patient/home": () => <PatientIndex />,
  "/patient/:id": ({ id }: { id: string }) => (
    <PatientHome id={id} page="demography" />
  ),
  "/patient/:id/:tab": ({
    id,
    tab,
  }: {
    id: string;
    tab: (typeof patientTabs)[number]["route"];
  }) => <PatientHome id={id} page={tab} />,
};

const AppointmentRoutes = {
  "/facility/:facilityId/appointments/:staffId/book-appointment": ({
    facilityId,
    staffId,
  }: {
    facilityId: string;
    staffId: string;
  }) => <ScheduleAppointment facilityId={facilityId} staffId={staffId} />,
  "/facility/:facilityId/appointments/:staffId/patient-select": ({
    facilityId,
    staffId,
  }: {
    facilityId: string;
    staffId: string;
  }) => <PatientSelect facilityId={facilityId} staffId={staffId} />,
  "/facility/:facilityId/appointments/:staffId/patient-registration": ({
    facilityId,
    staffId,
  }: {
    facilityId: string;
    staffId: string;
  }) => <PatientRegistration facilityId={facilityId} staffId={staffId} />,
};

export default function PatientRouter() {
  const pages = useRoutes(DashboardRoutes);

  const appointmentPages = useRoutes(AppointmentRoutes);

  if (!pages) {
    if (appointmentPages) {
      return <PatientUserProvider>{appointmentPages}</PatientUserProvider>;
    }
    return <PublicRouter />;
  }

  return (
    <PatientUserProvider>
      <SidebarProvider>
        <AppSidebar sidebarFor={SidebarFor.PATIENT} />
        <main
          id="pages"
          className="flex-1 overflow-y-auto bg-gray-100 focus:outline-none md:pb-2 md:pr-2"
        >
          <div className="relative z-10 flex h-16 shrink-0 bg-white shadow md:hidden">
            <div className="flex items-center">
              <SidebarTrigger className="px-2" />
            </div>
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
          <div
            className="max-w-8xl mx-auto mt-4 min-h-[96vh] rounded-lg border bg-gray-50 p-3 shadow"
            data-cui-page
          >
            <ErrorBoundary fallback={<ErrorPage forError="PAGE_LOAD_ERROR" />}>
              {pages}
            </ErrorBoundary>
          </div>
        </main>
      </SidebarProvider>
    </PatientUserProvider>
  );
}
