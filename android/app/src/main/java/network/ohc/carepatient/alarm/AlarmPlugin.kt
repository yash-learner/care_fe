package network.ohc.carepatient.alarm

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "Alarm")
class AlarmPlugin : Plugin() {
    @PluginMethod
    fun sync(call: PluginCall) {
        val apiUrl = call.getString("api_url").orEmpty()
        val snooze =
            if (call.hasOption("snooze_minutes")) {
                call.getInt("snooze_minutes") ?: 10
            } else {
                10
            }
        val rows = call.getArray("occurrences")
        val alarms = mutableListOf<DoseAlarm>()
        if (rows != null) {
            for (index in 0 until rows.length()) {
                val raw = rows.get(index)
                val obj = raw as? org.json.JSONObject ?: org.json.JSONObject(raw.toString())
                alarms.add(DoseAlarm.fromJson(obj))
            }
        }
        val app = context.applicationContext
        if (apiUrl.isNotBlank()) {
            AlarmStore.saveBaseUrl(app, apiUrl)
        }
        AlarmStore.saveSnoozeMinutes(app, snooze)
        AlarmScheduler(app).replaceAll(alarms)
        call.resolve()
    }

    @PluginMethod
    fun cancel(call: PluginCall) {
        AlarmScheduler(context.applicationContext).cancelAll()
        call.resolve()
    }

    @PluginMethod
    fun requestPermissions(call: PluginCall) {
        activity?.let { AlarmPermissions.request(it) }
        call.resolve()
    }
}
