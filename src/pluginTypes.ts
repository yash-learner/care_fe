import { LazyExoticComponent } from "react";

import { FacilityModel } from "@/components/Facility/models";
import { UserAssignedModel } from "@/components/Users/models";

import { EncounterTabProps } from "@/pages/Encounters/EncounterShow";

import { AppRoutes } from "./Routers/AppRouter";
import { FormContextValue } from "./components/Form/FormContext";
import { PatientMeta } from "./components/Patient/models";
import { pluginMap } from "./pluginMap";
import { PatientModel } from "./types/emr/patient";

export type PatientForm = PatientModel &
  PatientMeta & { age?: number; is_postpartum?: boolean };

export type DoctorConnectButtonComponentType = React.FC<{
  user: UserAssignedModel;
}>;

export type ScribeComponentType = React.FC;
export type ManageFacilityOptionsComponentType = React.FC<{
  facility?: FacilityModel;
}>;

export type ExtendFacilityConfigureComponentType = React.FC<{
  facilityId: string;
}>;

export type ExtendPatientRegisterFormComponentType = React.FC<{
  facilityId: string;
  patientId?: string;
  state: {
    form: {
      [key: string]: any;
    };
    errors: {
      [key: string]: string;
    };
  };
  dispatch: React.Dispatch<any>;
  field: FormContextValue<PatientForm>;
}>;

// Define supported plugin components
export type SupportedPluginComponents = {
  DoctorConnectButtons: DoctorConnectButtonComponentType;
  Scribe: ScribeComponentType;
  ManageFacilityOptions: ManageFacilityOptionsComponentType;
  EncounterContextEnabler: React.FC;
  ExtendFacilityConfigure: ExtendFacilityConfigureComponentType;
  ExtendPatientRegisterForm: ExtendPatientRegisterFormComponentType;
};

// Create a type for lazy-loaded components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyComponent<T extends React.FC<any>> = LazyExoticComponent<T>;

// Define PluginComponentMap with lazy-loaded components
export type PluginComponentMap = {
  [K in keyof SupportedPluginComponents]?: LazyComponent<
    SupportedPluginComponents[K]
  >;
};

type SupportedPluginExtensions =
  | "DoctorConnectButtons"
  | "PatientExternalRegistration";

export type PluginManifest = {
  plugin: string;
  routes: AppRoutes;
  extends: SupportedPluginExtensions[];
  components: PluginComponentMap;
  // navItems: INavItem[];
  encounterTabs?: Record<string, LazyComponent<React.FC<EncounterTabProps>>>;
};

export { pluginMap };
