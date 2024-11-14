import {
  ScheduleTemplate,
  ScheduleTemplateCreate,
} from "@/components/Schedule/schemas";

import { ModelCrudApis } from "@/Utils/request/api";

export const ScheduleAPIs = {
  templates: ModelCrudApis<ScheduleTemplate, ScheduleTemplateCreate>(
    "/api/v1/facility/{facility_id}/schedule",
  ),
};
