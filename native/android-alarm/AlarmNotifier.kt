package network.ohc.carepatient.alarm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import network.ohc.carepatient.AlarmActivity
import network.ohc.carepatient.R

object AlarmNotifier {
    const val CHANNEL_ID = "dose_alarms"

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val manager = context.getSystemService(NotificationManager::class.java)
        val sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        val attributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
        val channel = NotificationChannel(
            CHANNEL_ID,
            context.getString(R.string.alarm_channel_name),
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = context.getString(R.string.alarm_channel_description)
            setSound(sound, attributes)
            enableVibration(true)
            setBypassDnd(true)
            lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
        }
        manager.createNotificationChannel(channel)
    }

    fun show(context: Context, slotKey: String, alarms: List<DoseAlarm>) {
        if (alarms.isEmpty()) return
        ensureChannel(context)
        val fullScreen = PendingIntent.getActivity(
            context,
            AlarmSlots.requestCode(slotKey),
            AlarmActivity.intent(context, slotKey),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        val title = slotTitle(context, alarms)
        val body = alarms.joinToString(" · ") { it.medicationName }
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setAutoCancel(true)
            .setOngoing(true)
            .setFullScreenIntent(fullScreen, true)
            .setContentIntent(fullScreen)
            .build()

        val manager = context.getSystemService(NotificationManager::class.java)
        manager.notify(AlarmSlots.requestCode(slotKey), notification)
    }

    fun cancel(context: Context, slotKey: String) {
        val manager = context.getSystemService(NotificationManager::class.java)
        manager.cancel(AlarmSlots.requestCode(slotKey))
    }

    fun slotTitle(context: Context, alarms: List<DoseAlarm>): String {
        val dayPart = alarms.first().dayPart.replace('_', ' ').replaceFirstChar { it.uppercase() }
        return if (alarms.size == 1) {
            alarms.first().title.ifBlank { context.getString(R.string.alarm_kicker) }
        } else {
            context.getString(R.string.alarm_slot_title, dayPart, alarms.size)
        }
    }
}
