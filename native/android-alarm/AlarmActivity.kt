package network.ohc.carepatient

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import network.ohc.carepatient.alarm.AlarmNotifier
import network.ohc.carepatient.alarm.AlarmScheduler
import network.ohc.carepatient.alarm.AlarmStore
import network.ohc.carepatient.alarm.DoseActionClient
import network.ohc.carepatient.alarm.DoseAlarm
import java.text.DateFormat
import java.util.Date
import java.util.concurrent.Executors

class AlarmActivity : AppCompatActivity() {
    private val io = Executors.newSingleThreadExecutor()

    private val slotKey: String
        get() = intent.getStringExtra(EXTRA_SLOT_KEY).orEmpty()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        turnScreenOn()
        setContentView(R.layout.activity_alarm)
        render()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        render()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Stay until take / skip / snooze so a partial slot is not lost.
    }

    private fun render() {
        val alarms = AlarmStore.forSlot(this, slotKey)
        if (alarms.isEmpty()) {
            finish()
            return
        }

        findViewById<TextView>(R.id.alarm_title).text = AlarmNotifier.slotTitle(this, alarms)
        findViewById<TextView>(R.id.alarm_when).text =
            DateFormat.getTimeInstance(DateFormat.SHORT).format(Date(alarms.minOf { it.scheduledAtMillis }))

        val subtitle = buildString {
            val names = alarms.map { it.patientName }.filter { it.isNotBlank() }.distinct()
            if (names.size == 1) append(names.first())
            if (alarms.size == 1 && alarms.first().body.isNotBlank()) {
                if (isNotEmpty()) append(" · ")
                append(alarms.first().body)
            }
        }
        findViewById<TextView>(R.id.alarm_body).text = subtitle

        val list = findViewById<LinearLayout>(R.id.alarm_list)
        list.removeAllViews()
        val inflater = LayoutInflater.from(this)
        val showPatient = alarms.map { it.patientName }.distinct().size > 1
        alarms.forEach { alarm ->
            val row = inflater.inflate(R.layout.alarm_dose_row, list, false)
            row.findViewById<TextView>(R.id.dose_name).text =
                if (showPatient && alarm.patientName.isNotBlank()) {
                    "${alarm.patientName} · ${alarm.medicationName}"
                } else {
                    alarm.medicationName
                }
            row.findViewById<TextView>(R.id.dose_body).text = alarm.body
            row.findViewById<Button>(R.id.dose_taken).setOnClickListener {
                complete(listOf(alarm), "take") { it.takePath }
            }
            row.findViewById<Button>(R.id.dose_skip).setOnClickListener {
                complete(listOf(alarm), "skip") { it.skipPath }
            }
            list.addView(row)
        }

        val takeAll = findViewById<Button>(R.id.alarm_taken)
        takeAll.visibility = if (alarms.size > 1) View.VISIBLE else View.GONE
        takeAll.setOnClickListener { complete(alarms, "take") { it.takePath } }

        findViewById<Button>(R.id.alarm_snooze).setOnClickListener { snooze(alarms) }
        val skipAll = findViewById<Button>(R.id.alarm_skip)
        skipAll.visibility = if (alarms.size == 1) View.VISIBLE else View.GONE
        skipAll.setOnClickListener { complete(alarms, "skip") { it.skipPath } }
    }

    private fun complete(alarms: List<DoseAlarm>, action: String, path: (DoseAlarm) -> String) {
        val baseUrl = AlarmStore.baseUrl(this).orEmpty()
        io.execute {
            val ok = alarms.all { DoseActionClient.post(baseUrl, path(it)) }
            runOnUiThread {
                AlarmStore.remove(this, alarms.map { it.id })
                val remaining = AlarmStore.forSlot(this, slotKey)
                if (remaining.isEmpty()) {
                    AlarmScheduler(this).cancel(slotKey)
                    AlarmNotifier.cancel(this, slotKey)
                }
                if (!ok) {
                    Toast.makeText(this, getString(R.string.alarm_save_failed, action), Toast.LENGTH_LONG).show()
                }
                if (remaining.isEmpty()) finish() else render()
            }
        }
    }

    private fun snooze(alarms: List<DoseAlarm>) {
        val minutes = AlarmStore.snoozeMinutes(this)
        val baseUrl = AlarmStore.baseUrl(this).orEmpty()
        val body = """{"minutes":$minutes}"""
        io.execute {
            val ok = alarms.all { DoseActionClient.post(baseUrl, it.snoozePath, body) }
            runOnUiThread {
                AlarmNotifier.cancel(this, slotKey)
                AlarmScheduler(this).cancel(slotKey)
                AlarmScheduler(this).snooze(alarms, minutes)
                if (!ok) {
                    Toast.makeText(this, getString(R.string.alarm_snooze_offline), Toast.LENGTH_LONG).show()
                }
                finish()
            }
        }
    }

    private fun turnScreenOn() {
        setShowWhenLocked(true)
        setTurnScreenOn(true)
    }

    companion object {
        const val EXTRA_SLOT_KEY = AlarmScheduler.EXTRA_SLOT_KEY

        fun intent(context: Context, slotKey: String): Intent {
            return Intent(context, AlarmActivity::class.java).apply {
                putExtra(EXTRA_SLOT_KEY, slotKey)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
        }
    }
}
