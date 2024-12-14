import { useRoutes } from "raviger";
import { lazy } from "react";

import Login from "@/components/Auth/Login";
import ResetPassword from "@/components/Auth/ResetPassword";
import InvalidReset from "@/components/ErrorPages/InvalidReset";
import SessionExpired from "@/components/ErrorPages/SessionExpired";

import { DoctorAppointmentsPage } from "@/pages/Facility/DoctorAppointmentsPage";
import { FacilitiesPage } from "@/pages/Facility/FacilitiesPage";
import { FacilityDetailsPage } from "@/pages/Facility/FacilityDetailsPage";
import { LandingPage } from "@/pages/Landing/LandingPage";
import { PatientRegistration } from "@/pages/Patient/PatientRegistration";

const LicensesPage = lazy(() => import("@/components/Licenses/LicensesPage"));

const routes = {
  "/": () => <LandingPage />,
  "/facilities": () => <FacilitiesPage />,
  "/facility/:id": ({ id }: { id: string }) => <FacilityDetailsPage id={id} />,
  "/facility/:id/appointments/:doctorUsername": ({
    id,
    doctorUsername,
  }: {
    id: string;
    doctorUsername: string;
  }) => (
    <DoctorAppointmentsPage facilityId={id} doctorUsername={doctorUsername} />
  ),
  "/facility/:id/appointments/:doctorUsername/patient-registration": ({
    id,
    doctorUsername,
  }: {
    id: string;
    doctorUsername: string;
  }) => <PatientRegistration facilityId={id} doctorUsername={doctorUsername} />,
  "/login": () => <Login />,
  "/forgot-password": () => <Login forgot={true} />,
  "/password_reset/:token": ({ token }: { token: string }) => (
    <ResetPassword token={token} />
  ),
  "/session-expired": () => <SessionExpired />,
  "/licenses": () => <LicensesPage />,
  "/invalid-reset": () => <InvalidReset />,
};

export default function SessionRouter() {
  return useRoutes(routes) || <Login />;
}
