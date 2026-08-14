package network.ohc.carepatient

import android.app.Application
import network.ohc.carepatient.alarm.AlarmNotifier

class CarePatientApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AlarmNotifier.ensureChannel(this)
    }
}
