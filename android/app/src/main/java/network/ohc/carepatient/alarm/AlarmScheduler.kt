package network.ohc.carepatient.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class AlarmScheduler(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    fun replaceAll(alarms: List<DoseAlarm>) {
        val previous = AlarmSlots.group(AlarmStore.all(context))
        val next = AlarmSlots.group(alarms)
        previous.keys.filterNot { next.containsKey(it) }.forEach { cancel(it) }
        AlarmStore.save(context, alarms)
        next.forEach { (slotKey, rows) -> arm(slotKey, rows) }
    }

    fun rearmAll() {
        AlarmSlots.group(AlarmStore.all(context)).forEach { (slotKey, rows) ->
            arm(slotKey, rows)
        }
    }

    fun cancelAll() {
        AlarmSlots.group(AlarmStore.all(context)).keys.forEach { cancel(it) }
        AlarmStore.save(context, emptyList())
    }

    fun arm(slotKey: String, alarms: List<DoseAlarm>) {
        if (alarms.isEmpty()) {
            cancel(slotKey)
            return
        }
        val triggerAt = triggerMillis(alarms.minOf { it.scheduledAtMillis })
        if (triggerAt == null) {
            cancel(slotKey)
            return
        }
        val pending = pendingIntent(slotKey, PendingIntent.FLAG_UPDATE_CURRENT)
        try {
            when {
                canScheduleExact() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ->
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
                canScheduleExact() ->
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pending)
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ->
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
                else ->
                    alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pending)
            }
        } catch (error: SecurityException) {
            Log.w(TAG, "Exact alarm permission missing; falling back to inexact", error)
            alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAt, pending)
        }
    }

    fun cancel(slotKey: String) {
        val pending = pendingIntent(slotKey, PendingIntent.FLAG_UPDATE_CURRENT)
        alarmManager.cancel(pending)
        pending.cancel()
    }

    fun snooze(alarms: List<DoseAlarm>, minutes: Int): List<DoseAlarm> {
        val whenMs = System.currentTimeMillis() + minutes * 60_000L
        val updated = alarms.map { it.copy(scheduledAtMillis = whenMs) }
        AlarmStore.upsertAll(context, updated)
        val slotKey = updated.first().slotKey()
        arm(slotKey, updated)
        return updated
    }

    private fun triggerMillis(scheduledAtMillis: Long): Long? {
        val now = System.currentTimeMillis()
        val lookback = now - TWO_HOURS_MS
        return when {
            scheduledAtMillis > now -> scheduledAtMillis
            scheduledAtMillis >= lookback -> now + 2_000L
            else -> null
        }
    }

    private fun canScheduleExact(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            alarmManager.canScheduleExactAlarms()
        } else {
            true
        }
    }

    private fun pendingIntent(slotKey: String, extraFlags: Int): PendingIntent {
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            action = ACTION_DOSE
            putExtra(EXTRA_SLOT_KEY, slotKey)
        }
        return PendingIntent.getBroadcast(
            context,
            AlarmSlots.requestCode(slotKey),
            intent,
            PendingIntent.FLAG_IMMUTABLE or extraFlags,
        )
    }

    companion object {
        const val ACTION_DOSE = "network.ohc.carepatient.action.DOSE_ALARM"
        const val EXTRA_SLOT_KEY = "slot_key"
        private const val TWO_HOURS_MS = 2 * 60 * 60 * 1000L
        private const val TAG = "AlarmScheduler"
    }
}
