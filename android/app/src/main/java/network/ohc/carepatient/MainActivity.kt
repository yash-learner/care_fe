package network.ohc.carepatient

import android.os.Bundle
import com.getcapacitor.BridgeActivity
import network.ohc.carepatient.alarm.AlarmPlugin

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(AlarmPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
