package network.ohc.carepatient.alarm

import android.content.Context
import org.json.JSONArray

object AlarmStore {
    private const val PREFS = "dose_alarms"
    private const val KEY_ALARMS = "alarms"
    private const val KEY_BASE_URL = "base_url"
    private const val KEY_SNOOZE_MINUTES = "snooze_minutes"

    fun save(context: Context, alarms: List<DoseAlarm>) {
        val array = JSONArray()
        alarms.forEach { array.put(it.toJson()) }
        prefs(context).edit().putString(KEY_ALARMS, array.toString()).apply()
    }

    fun all(context: Context): List<DoseAlarm> {
        val raw = prefs(context).getString(KEY_ALARMS, null) ?: return emptyList()
        return runCatching {
            val array = JSONArray(raw)
            (0 until array.length()).map { DoseAlarm.fromJson(array.getJSONObject(it)) }
        }.getOrDefault(emptyList())
    }

    fun forSlot(context: Context, slotKey: String): List<DoseAlarm> {
        return all(context).filter { it.slotKey() == slotKey }
    }

    fun remove(context: Context, ids: Collection<Long>) {
        val drop = ids.toSet()
        save(context, all(context).filterNot { drop.contains(it.id) })
    }

    fun upsertAll(context: Context, updated: List<DoseAlarm>) {
        val byId = all(context).associateBy { it.id }.toMutableMap()
        updated.forEach { byId[it.id] = it }
        save(context, byId.values.toList())
    }

    fun saveBaseUrl(context: Context, baseUrl: String) {
        prefs(context).edit().putString(KEY_BASE_URL, baseUrl.trimEnd('/')).apply()
    }

    fun baseUrl(context: Context): String? = prefs(context).getString(KEY_BASE_URL, null)

    fun saveSnoozeMinutes(context: Context, minutes: Int) {
        prefs(context).edit().putInt(KEY_SNOOZE_MINUTES, minutes.coerceIn(1, 120)).apply()
    }

    fun snoozeMinutes(context: Context): Int = prefs(context).getInt(KEY_SNOOZE_MINUTES, 10)

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}
