import { HttpMethod, Type } from "@/Utils/request/types";
import {
  AlarmCalendar,
  AlarmSyncResponse,
  DoseHistory,
  PatientAlarmArmBody,
  PatientAlarmClockList,
  PatientAlarmClockPatch,
  PatientAlarmClockResponse,
  PatientAlarmDisarmBody,
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
  doses: {
    path: "/api/care_reminders/doses/",
    method: HttpMethod.GET,
    TRes: Type<DoseHistory>(),
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
  arm: {
    path: "/api/care_reminders/arm/",
    method: HttpMethod.POST,
    TBody: Type<PatientAlarmArmBody>(),
    TRes: Type<PatientAlarmClockResponse>(),
  },
  disarm: {
    path: "/api/care_reminders/disarm/",
    method: HttpMethod.POST,
    TBody: Type<PatientAlarmDisarmBody>(),
    TRes: Type<PatientAlarmClockResponse>(),
  },
} as const;
