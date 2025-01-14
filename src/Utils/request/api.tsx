import {
  CommentModel,
  FacilityModel,
  FacilityRequest,
} from "@/components/Facility/models";
import {
  CreateFileRequest,
  CreateFileResponse,
  FileUploadModel,
} from "@/components/Patient/models";
import {
  UpdatePasswordForm,
  UserAssignedModel,
  UserModel,
} from "@/components/Users/models";

import { PaginatedResponse } from "@/Utils/request/types";
import {
  AppointmentPatient,
  AppointmentPatientRegister,
} from "@/pages/Patient/Utils";
import { Encounter, EncounterEditRequest } from "@/types/emr/encounter";
import { MedicationRequest } from "@/types/emr/medicationRequest";
import { MedicationStatement } from "@/types/emr/medicationStatement";
import { PartialPatientModel, Patient } from "@/types/emr/newPatient";
import {
  Observation,
  ObservationAnalyzeResponse,
} from "@/types/emr/observation";
import { PatientModel } from "@/types/emr/patient";
import {
  BaseFacility,
  CreateFacility,
  FacilityData,
} from "@/types/facility/facility";
import {
  FacilityOrganization,
  FacilityOrganizationCreate,
  FacilityOrganizationResponse,
} from "@/types/facilityOrganization/facilityOrganization";
import { Message } from "@/types/notes/messages";
import { Thread } from "@/types/notes/threads";
import {
  OrganizationUserRole,
  RoleResponse,
} from "@/types/organization/organization";
import { PlugConfig } from "@/types/plugConfig";
import {
  BatchRequestBody,
  BatchSubmissionResult,
} from "@/types/questionnaire/batch";
import { Code } from "@/types/questionnaire/code";
import type { QuestionnaireResponse } from "@/types/questionnaire/questionnaireResponse";
import {
  CreateResourceRequest,
  ResourceRequest,
  UpdateResourceRequest,
} from "@/types/resourceRequest/resourceRequest";
import { UserBase } from "@/types/user/user";

/**
 * A fake function that returns an empty object casted to type T
 * @returns Empty object as type T
 */
export function Type<T>(): T {
  return {} as T;
}

export interface JwtTokenObtainPair {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const API = <TResponse, TBody = undefined>(
  route: `${HttpMethod} ${string}`,
) => {
  const [method, path] = route.split(" ") as [HttpMethod, string];
  return {
    path,
    method,
    TRes: Type<TResponse>(),
    TBody: Type<TBody>(),
  };
};

const routes = {
  // Auth Endpoints
  login: {
    path: "/api/v1/auth/login/",
    method: "POST",
    noAuth: true,
    TRes: Type<JwtTokenObtainPair>(),
    TBody: Type<LoginCredentials>(),
  },

  token_refresh: {
    path: "/api/v1/auth/token/refresh/",
    method: "POST",
    TRes: Type<JwtTokenObtainPair>(),
    TBody: Type<{ refresh: JwtTokenObtainPair["refresh"] }>(),
  },

  token_verify: {
    path: "/api/v1/auth/token/verify/",
    method: "POST",
  },

  checkResetToken: {
    path: "/api/v1/password_reset/check/",
    method: "POST",
    noAuth: true,
    TRes: Type<Record<string, never>>(),
    TBody: Type<{
      token: string;
    }>(),
  },

  resetPassword: {
    path: "/api/v1/password_reset/confirm/",
    method: "POST",
    noAuth: true,
    TRes: Type<Record<string, never>>(),
    TBody: Type<{
      password: string;
      confirm: string;
    }>(),
  },

  forgotPassword: {
    path: "/api/v1/password_reset/",
    method: "POST",
    noAuth: true,
    TRes: Type<Record<string, never>>(),
    TBody: Type<{
      username: string;
    }>(),
  },

  updatePassword: {
    path: "/api/v1/password_change/",
    method: "PUT",
    TRes: Type<{ message: string }>(),
    TBody: Type<UpdatePasswordForm>(),
  },
  // User Endpoints
  currentUser: {
    path: "/api/v1/users/getcurrentuser/",
    TRes: Type<UserModel>(),
  },

  userList: {
    path: "/api/v1/users/",
    method: "GET",
    TRes: Type<PaginatedResponse<UserModel>>(),
  },

  deleteProfilePicture: {
    path: "/api/v1/users/{username}/profile_picture/",
    method: "DELETE",
    TRes: Type<UserModel>(),
  },

  deleteUser: {
    path: "/api/v1/users/{username}/",
    method: "DELETE",
    TRes: Type<Record<string, never>>(),
  },

  // Facility Endpoints

  getPermittedFacilities: {
    path: "/api/v1/facility/",
    TRes: Type<PaginatedResponse<FacilityModel>>(),
  },

  createFacility: {
    path: "/api/v1/facility/",
    method: "POST",
    TRes: Type<FacilityModel>(),
    TBody: Type<FacilityRequest>(),
  },

  getPermittedFacility: {
    path: "/api/v1/facility/{id}/",
    method: "GET",
    TRes: Type<FacilityModel>(),
  },

  getAnyFacility: {
    path: "/api/v1/getallfacilities/{id}/",
    method: "GET",
    TRes: Type<FacilityModel>(),
  },

  updateFacility: {
    path: "/api/v1/facility/{id}/",
    method: "PUT",
    TRes: Type<FacilityModel>(),
    TBody: Type<FacilityRequest>(),
  },

  deleteFacilityCoverImage: {
    path: "/api/v1/facility/{id}/cover_image/",
    method: "DELETE",
    TRes: Type<Record<string, never>>(),
  },

  getFacilityUsers: {
    path: "/api/v1/facility/{facility_id}/get_users/",
    TRes: Type<PaginatedResponse<UserAssignedModel>>(),
  },

  getScheduleAbleFacilityUser: {
    path: "/api/v1/facility/{facility_id}/schedulable_users/{user_id}/",
    TRes: Type<UserBase>(),
  },

  getScheduleAbleFacilityUsers: {
    path: "/api/v1/facility/{facility_id}/schedulable_users/",
    TRes: Type<PaginatedResponse<UserAssignedModel>>(),
  },

  // Download Api
  deleteFacility: {
    path: "/api/v1/facility/{id}/",
    method: "DELETE",
    TRes: Type<Record<string, never>>(),
  },

  // Patient

  searchPatient: {
    path: "/api/v1/patient/search/",
    method: "POST",
    TRes: Type<PaginatedResponse<PartialPatientModel>>(),
  },

  addPatient: {
    path: "/api/v1/patient/",
    method: "POST",
    TRes: Type<PatientModel>(),
  },
  getPatient: {
    path: "/api/v1/patient/{id}/",
    method: "GET",
    TBody: Type<PatientModel>(),
    TRes: Type<PatientModel>(),
  },
  updatePatient: {
    path: "/api/v1/patient/{id}/",
    method: "PUT",
    TRes: Type<PatientModel>(),
  },

  //Profile

  getUserDetails: {
    path: "/api/v1/users/{username}/",
    method: "GET",
    TRes: Type<UserBase>(),
  },

  // FileUpload Create
  createUpload: {
    path: "/api/v1/files/",
    method: "POST",
    TBody: Type<CreateFileRequest>(),
    TRes: Type<CreateFileResponse>(),
  },
  viewUpload: {
    path: "/api/v1/files/",
    method: "GET",
    TRes: Type<PaginatedResponse<FileUploadModel>>(),
  },
  retrieveUpload: {
    path: "/api/v1/files/{id}/",
    method: "GET",
    TRes: Type<FileUploadModel>(),
  },
  editUpload: {
    path: "/api/v1/files/{id}/",
    method: "PUT",
    TBody: Type<Partial<FileUploadModel>>(),
    TRes: Type<FileUploadModel>(),
  },
  markUploadCompleted: {
    path: "/api/v1/files/{id}/mark_upload_completed/",
    method: "POST",
    TRes: Type<FileUploadModel>(),
  },
  archiveUpload: {
    path: "/api/v1/files/{id}/archive/",
    method: "POST",
    TRes: Type<FileUploadModel>(),
    TBody: Type<{ archive_reason: string }>(),
  },

  // Request
  createResource: {
    path: "/api/v1/resource/",
    method: "POST",
    TRes: Type<ResourceRequest>(),
    TBody: Type<CreateResourceRequest>(),
  },
  updateResource: {
    path: "/api/v1/resource/{id}/",
    method: "PUT",
    TRes: Type<ResourceRequest>(),
    TBody: Type<UpdateResourceRequest>(),
  },
  listResourceRequests: {
    path: "/api/v1/resource/",
    method: "GET",
    TRes: Type<PaginatedResponse<ResourceRequest>>(),
  },
  getResourceDetails: {
    path: "/api/v1/resource/{id}/",
    method: "GET",
    TRes: Type<ResourceRequest>(),
  },
  downloadResourceRequests: {
    path: "/api/v1/resource/",
    method: "GET",
    TRes: Type<string>(),
  },
  getResourceComments: {
    path: "/api/v1/resource/{id}/comment/",
    method: "GET",
    TRes: Type<PaginatedResponse<CommentModel>>(),
  },
  addResourceComments: {
    path: "/api/v1/resource/{id}/comment/",
    method: "POST",
    TRes: Type<CommentModel>(),
    TBody: Type<Partial<CommentModel>>(),
  },

  facility: {
    getUsers: {
      path: "/api/v1/facility/{facility_id}/users/",
      method: "GET",
      TRes: Type<PaginatedResponse<UserBase>>(),
    },
    list: {
      path: "/api/v1/facility/",
      method: "GET",
      TRes: Type<PaginatedResponse<BaseFacility>>(),
    },
    create: {
      path: "/api/v1/facility/",
      method: "POST",
      TRes: Type<BaseFacility>(),
      TBody: Type<CreateFacility>(),
    },
    show: {
      path: "/api/v1/facility/{id}/",
      method: "GET",
      TRes: Type<FacilityData>(),
    },
  },

  valueset: {
    expand: {
      path: "/api/v1/valueset/{system}/expand/",
      method: "POST",
      TBody: Type<{ search: string; count: number }>(),
      TRes: Type<{ results: Code[] }>(),
    },
  },

  batchRequest: {
    path: "/api/v1/batch_requests/",
    method: "POST",
    TRes: Type<{
      results: BatchSubmissionResult[];
    }>(),
    TBody: Type<BatchRequestBody>(),
  },

  plugConfig: {
    listPlugConfigs: {
      path: "/api/v1/plug_config/",
      method: "GET",
      TRes: Type<{ configs: PlugConfig[] }>(),
    },
    getPlugConfig: {
      path: "/api/v1/plug_config/{slug}/",
      method: "GET",
      TRes: Type<PlugConfig>(),
    },
    createPlugConfig: {
      path: "/api/v1/plug_config/",
      method: "POST",
      TReq: Type<PlugConfig>(),
      TRes: Type<PlugConfig>(),
    },
    updatePlugConfig: {
      path: "/api/v1/plug_config/{slug}/",
      method: "PATCH",
      TReq: Type<PlugConfig>(),
      TRes: Type<PlugConfig>(),
    },
    deletePlugConfig: {
      path: "/api/v1/plug_config/{slug}/",
      method: "DELETE",
      TRes: Type<Record<string, never>>(),
    },
  },
  getQuestionnaireResponses: {
    path: "/api/v1/patient/{patientId}/questionnaire_response/",
    method: "GET",
    TRes: Type<PaginatedResponse<QuestionnaireResponse>>(),
  },
  getQuestionnaireResponse: {
    path: "/api/v1/patient/{patientId}/questionnaire_response/{responseId}/",
    method: "GET",
    TRes: Type<QuestionnaireResponse>(),
  },
  listObservations: {
    path: "/api/v1/patient/{patientId}/observation/",
    method: "GET",
    TRes: Type<PaginatedResponse<Observation>>(),
  },
  observationsAnalyse: {
    path: "/api/v1/patient/{patientId}/observation/analyse/",
    method: "POST",
    TRes: Type<ObservationAnalyzeResponse>(),
  },
  facilityOrganization: {
    list: {
      path: "/api/v1/facility/{facilityId}/organizations/",
      method: "GET",
      TRes: {} as FacilityOrganizationResponse,
    },
    get: {
      path: "/api/v1/facility/{facilityId}/organizations/{organizationId}/",
      method: "GET",
      TRes: {} as FacilityOrganization,
    },
    create: {
      path: "/api/v1/facility/{facilityId}/organizations/",
      method: "POST",
      TRes: {} as FacilityOrganization,
      TBody: {} as FacilityOrganizationCreate,
    },
    listUsers: {
      path: "/api/v1/facility/{facilityId}/organizations/{organizationId}/users/",
      method: "GET",
      TRes: {} as PaginatedResponse<OrganizationUserRole>,
    },
    assignUser: {
      path: "/api/v1/facility/{facilityId}/organizations/{organizationId}/users/",
      method: "POST",
      TRes: {} as OrganizationUserRole,
      TBody: {} as { user: string; role: string },
    },
    updateUserRole: {
      path: "/api/v1/facility/{facilityId}/organizations/{organizationId}/users/{userRoleId}/",
      method: "PUT",
      TRes: {} as OrganizationUserRole,
      TBody: {} as { user: string; role: string },
    },
    removeUserRole: {
      path: "/api/v1/facility/{facilityId}/organizations/{organizationId}/users/{userRoleId}/",
      method: "DELETE",
      TRes: {} as Record<string, never>,
    },
  },

  // Role Routes
  role: {
    list: {
      path: "/api/v1/role/",
      method: "GET",
      TRes: {} as RoleResponse,
    },
  },

  // Notes Routes
  notes: {
    patient: {
      listThreads: {
        path: "/api/v1/patient/{patientId}/thread/",
        method: "GET",
        TRes: Type<PaginatedResponse<Thread>>(),
        TQuery: Type<{ encounter: string }>(),
      },
      createThread: {
        path: "/api/v1/patient/{patientId}/thread/",
        method: "POST",
        TRes: Type<Thread>(),
        TBody: Type<{ title: string; encounter: string }>(),
      },
      getMessages: {
        path: "/api/v1/patient/{patientId}/thread/{threadId}/note/",
        method: "GET",
        TRes: Type<PaginatedResponse<Message>>(),
      },
      postMessage: {
        path: "/api/v1/patient/{patientId}/thread/{threadId}/note/",
        method: "POST",
        TRes: Type<Message>(),
        TBody: Type<{ message: string }>(),
      },
    },
  },

  // Encounter Routes
  encounter: {
    list: {
      path: "/api/v1/encounter/",
      method: "GET",
      TRes: Type<PaginatedResponse<Encounter>>(),
    },
    create: {
      path: "/api/v1/encounter/",
      method: "POST",
      TRes: Type<Encounter>(),
      TBody: Type<EncounterEditRequest>(),
    },
    get: {
      path: "/api/v1/encounter/{id}/",
      method: "GET",
      TRes: Type<Encounter>(),
    },
    update: {
      path: "/api/v1/encounter/{id}/",
      method: "PUT",
      TRes: Type<Encounter>(),
      TBody: Type<EncounterEditRequest>(),
    },
    addOrganization: {
      path: "/api/v1/encounter/{encounterId}/organizations_add/",
      method: "POST",
      TRes: Type<Encounter>(),
      TBody: Type<{ organization: string }>(),
    },
    removeOrganization: {
      path: "/api/v1/encounter/{encounterId}/organizations_remove/",
      method: "POST",
      TRes: Type<Encounter>(),
      TBody: Type<{ organization: string }>(),
    },
  },

  // New Patient Routes

  patient: {
    getPatient: {
      path: "/api/v1/patient/{id}/",
      method: "GET",
      TBody: Type<Patient>(),
      TRes: Type<Patient>(),
    },
    allergyIntolerance: {
      create: {
        method: "POST",
        path: "/api/v1/patient/:patientId/allergy_intolerance/",
      },
    },
    users: {
      addUser: {
        method: "POST",
        path: "/api/v1/patient/{patientId}/add_user/",
        TRes: Type<UserBase>(),
        TBody: Type<{ user: string; role: string }>(),
      },
      listUsers: {
        method: "GET",
        path: "/api/v1/patient/{patientId}/get_users/",
        TRes: Type<PaginatedResponse<UserBase>>(),
      },
      removeUser: {
        method: "POST",
        path: "/api/v1/patient/{patientId}/delete_user/",
        TRes: Type<{ user: string }>(),
      },
    },
    search_retrieve: {
      path: "/api/v1/patient/search_retrieve/",
      method: "POST",
      TRes: Type<Patient>(),
      TBody: Type<{
        phone_number: string;
        year_of_birth: string;
        partial_id: string;
      }>(),
    },
  },

  // OTP Routes
  otp: {
    sendOtp: {
      path: "/api/v1/otp/send/",
      method: "POST",
      TBody: Type<{ phone_number: string }>(),
      TRes: Type<Record<string, never>>(),
      auth: {
        key: "Authorization",
        value: "{OTP_API_KEY}",
        type: "header",
      },
    },
    loginByOtp: {
      path: "/api/v1/otp/login/",
      method: "POST",
      TBody: Type<{ phone_number: string; otp: string }>(),
      TRes: Type<
        { access: string } | { errors: Array<Record<string, string>> }
      >(),
    },
    getPatient: {
      path: "/api/v1/otp/patient/",
      method: "GET",
      TRes: Type<PaginatedResponse<AppointmentPatient>>(),
      auth: {
        key: "Authorization",
        value: "Bearer {token}",
        type: "header",
      },
    },
    createPatient: {
      path: "/api/v1/otp/patient/",
      method: "POST",
      TBody: Type<Partial<AppointmentPatientRegister>>(),
      TRes: Type<AppointmentPatient>(),
      auth: {
        key: "Authorization",
        value: "Bearer {token}",
        type: "header",
      },
    },
  },

  // Medication
  medicationRequest: {
    list: {
      path: "/api/v1/patient/{patientId}/medication/request/",
      method: "GET",
      TRes: Type<PaginatedResponse<MedicationRequest>>(),
    },
  },

  medicationStatement: {
    list: {
      path: "/api/v1/patient/{patientId}/medication/statement/",
      method: "GET",
      TRes: Type<PaginatedResponse<MedicationStatement>>(),
    },
  },
} as const;

export default routes;
