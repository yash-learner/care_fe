package network.ohc.carepatient.alarm

import android.Manifest
import android.app.Activity
import android.app.AlarmManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object AlarmPermissions {
    private const val PREFS = "alarm_permissions"
    private const val ASKED_EXACT = "asked_exact"
    private const val ASKED_FULL_SCREEN = "asked_full_screen"
    private const val REQUEST_POST_NOTIFICATIONS = 7101

    fun request(activity: Activity) {
        requestNotifications(activity)
        requestExactAlarmsOnce(activity)
        requestFullScreenOnce(activity)
    }

    private fun requestNotifications(activity: Activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val granted = ContextCompat.checkSelfPermission(
            activity,
            Manifest.permission.POST_NOTIFICATIONS,
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                REQUEST_POST_NOTIFICATIONS,
            )
        }
    }

    private fun requestExactAlarmsOnce(activity: Activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return
        val alarmManager = activity.getSystemService(AlarmManager::class.java)
        if (alarmManager.canScheduleExactAlarms()) return
        if (alreadyAsked(activity, ASKED_EXACT)) return
        markAsked(activity, ASKED_EXACT)
        activity.startActivity(
            Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                data = Uri.parse("package:${activity.packageName}")
            },
        )
    }

    private fun requestFullScreenOnce(activity: Activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return
        val notifications = activity.getSystemService(NotificationManager::class.java)
        if (notifications.canUseFullScreenIntent()) return
        if (alreadyAsked(activity, ASKED_FULL_SCREEN)) return
        markAsked(activity, ASKED_FULL_SCREEN)
        activity.startActivity(
            Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                data = Uri.parse("package:${activity.packageName}")
            },
        )
    }

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    private fun alreadyAsked(context: Context, key: String) = prefs(context).getBoolean(key, false)

    private fun markAsked(context: Context, key: String) {
        prefs(context).edit().putBoolean(key, true).apply()
    }
}
