package network.ohc.carepatient.alarm

import org.json.JSONObject
import java.time.Instant
import java.time.OffsetDateTime

data class DoseAlarm(
    val id: Long,
    val externalId: String,
    val scheduledAtMillis: Long,
    val title: String,
    val body: String,
    val medicationName: String,
    val patientId: String,
    val patientName: String,
    val dayPart: String,
    val takePath: String,
    val skipPath: String,
    val snoozePath: String,
    val firedPath: String,
) {
    fun slotKey(): String = AlarmSlots.key(patientId, scheduledAtMillis)

    fun toJson(): JSONObject =
        JSONObject()
            .put("id", id)
            .put("external_id", externalId)
            .put("scheduled_at_millis", scheduledAtMillis)
            .put("title", title)
            .put("body", body)
            .put("medication_name", medicationName)
            .put("patient_id", patientId)
            .put("patient_name", patientName)
            .put("day_part", dayPart)
            .put("take_path", takePath)
            .put("skip_path", skipPath)
            .put("snooze_path", snoozePath)
            .put("fired_path", firedPath)

    companion object {
        fun fromJson(row: JSONObject): DoseAlarm {
            val scheduled =
                if (row.has("scheduled_at_millis")) {
                    row.getLong("scheduled_at_millis")
                } else {
                    parseMillis(row.optString("scheduled_at"))
                }
            return DoseAlarm(
                id = row.optLong("id"),
                externalId = row.optString("external_id"),
                scheduledAtMillis = scheduled,
                title = row.optString("title"),
                body = row.optString("body"),
                medicationName = row.optString("medication_name"),
                patientId = row.optString("patient_id"),
                patientName = row.optString("patient_name"),
                dayPart = row.optString("day_part"),
                takePath = row.optString("take_path"),
                skipPath = row.optString("skip_path"),
                snoozePath = row.optString("snooze_path"),
                firedPath = row.optString("fired_path"),
            )
        }

        fun parseMillis(iso: String): Long {
            if (iso.isBlank()) return 0L
            return try {
                Instant.parse(iso).toEpochMilli()
            } catch (_: Exception) {
                OffsetDateTime.parse(iso).toInstant().toEpochMilli()
            }
        }
    }
}
