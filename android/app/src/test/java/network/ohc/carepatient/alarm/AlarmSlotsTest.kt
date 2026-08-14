package network.ohc.carepatient.alarm

import org.junit.Assert.assertEquals
import org.junit.Test

class AlarmSlotsTest {
    @Test
    fun sameMinuteSamePatientSharesASlot() {
        val a = 1_700_000_000_000L
        val b = a + 30_000L
        assertEquals(AlarmSlots.key("p1", a), AlarmSlots.key("p1", b))
    }

    @Test
    fun differentPatientsStaySeparate() {
        val t = 1_700_000_000_000L
        assert(AlarmSlots.key("ada", t) != AlarmSlots.key("child", t))
    }
}
