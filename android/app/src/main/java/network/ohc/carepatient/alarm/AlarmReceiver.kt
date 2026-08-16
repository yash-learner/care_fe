package network.ohc.carepatient.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import network.ohc.carepatient.AlarmActivity

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val slotKey = intent.getStringExtra(AlarmScheduler.EXTRA_SLOT_KEY) ?: return
        val alarms = AlarmStore.forSlot(context, slotKey)
        if (alarms.isEmpty()) return

        AlarmNotifier.show(context, slotKey, alarms)

        val screen = AlarmActivity.intent(context, slotKey).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            context.startActivity(screen)
        } catch (error: Exception) {
            Log.w(TAG, "Could not start alarm activity; relying on full-screen intent", error)
        }

        val pending = goAsync()
        Thread {
            try {
                val baseUrl = AlarmStore.baseUrl(context) ?: return@Thread
                alarms.forEach { DoseActionClient.post(baseUrl, it.firedPath) }
            } catch (error: Exception) {
                Log.w(TAG, "Could not record alarm fire", error)
            } finally {
                pending.finish()
            }
        }.start()
    }

    companion object {
        private const val TAG = "AlarmReceiver"
    }
}
