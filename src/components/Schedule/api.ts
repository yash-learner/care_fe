import {
  ScheduleTemplate,
  ScheduleTemplateCreate,
} from "@/components/Schedule/schemas";

import { Type } from "@/Utils/request/api";
import { PaginatedResponse } from "@/Utils/request/types";

export const ScheduleAPIs = {
  createScheduleTemplate: {
    path: "/api/v1/facility/{facility_id}/schedule/",
    method: "POST",
    TRes: Type<ScheduleTemplate>(),
    TBody: Type<ScheduleTemplateCreate>(),
  },
  listScheduleTemplates: {
    path: "/api/v1/facility/{facility_id}/schedule/",
    method: "GET",
    TRes: Type<PaginatedResponse<ScheduleTemplate>>(),
  },
} as const;
