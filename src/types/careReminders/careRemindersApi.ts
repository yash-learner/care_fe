import { HttpMethod, Type } from "@/Utils/request/types";
import {
  AlarmCalendar,
  AlarmSyncResponse,
} from "@/types/careReminders/careReminders";

export default {
  sync: {
    path: "/api/care_reminders/sync/",
    method: HttpMethod.POST,
    TBody: Type<Record<string, unknown>>(),
    TRes: Type<AlarmSyncResponse>(),
  },
  alarms: {
    path: "/api/care_reminders/alarms/",
    method: HttpMethod.GET,
    TRes: Type<AlarmCalendar>(),
  },
} as const;
