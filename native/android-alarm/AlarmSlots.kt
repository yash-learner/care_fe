package network.ohc.carepatient.alarm

object AlarmSlots {
    fun key(patientId: String, scheduledAtMillis: Long): String {
        val minute = scheduledAtMillis / 60_000L
        val who = patientId.ifBlank { "_" }
        return "$who|$minute"
    }

    fun requestCode(slotKey: String): Int {
        val hashed = slotKey.hashCode()
        return if (hashed == Int.MIN_VALUE) 1 else kotlin.math.abs(hashed).coerceAtLeast(1)
    }

    fun group(alarms: List<DoseAlarm>): Map<String, List<DoseAlarm>> {
        return alarms.groupBy { it.slotKey() }.mapValues { (_, rows) ->
            rows.sortedBy { it.medicationName }
        }
    }
}
