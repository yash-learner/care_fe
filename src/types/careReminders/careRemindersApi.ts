import { HttpMethod, Type } from "@/Utils/request/types";
import {
  AlarmCalendar,
  AlarmSyncResponse,
  PatientAlarmClockList,
  PatientAlarmClockPatch,
  PatientAlarmClockResponse,
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
  clocks: {
    path: "/api/care_reminders/clocks/",
    method: HttpMethod.GET,
    TRes: Type<PatientAlarmClockList>(),
  },
  updateClocks: {
    path: "/api/care_reminders/clocks/",
    method: HttpMethod.PATCH,
    TBody: Type<PatientAlarmClockPatch>(),
    TRes: Type<PatientAlarmClockResponse>(),
  },
} as const;
