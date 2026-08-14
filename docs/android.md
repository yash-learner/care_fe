# Patient Android APK (Capacitor + exact alarms)

The APK is `care_fe` in a WebView. It starts at **`/patient/login`**, not the staff EMR. Exact alarms are a Capacitor plugin (`Alarm.sync` / `Alarm.cancel`) ported from `care_medicine_reminder`, with same-minute medicines grouped on one lock screen.

## Morning test (debug APK)

On your machine (this cloud environment has no Android SDK):

```bash
cd care_fe
git checkout cursor/patient-capacitor-alarms-4f0c
npm install
npx cap add android   # first time only
bash scripts/apply-android-alarm.sh
npx cap sync android
```

Point the WebView at your running patient portal. Default is the emulator host:

| Where the app runs | `CAPACITOR_SERVER_URL` |
| --- | --- |
| Android emulator | `http://10.0.2.2:4000` (default) |
| Physical phone, USB | `http://127.0.0.1:4000` plus `adb reverse tcp:4000 tcp:4000` and reverse the CARE API port too |
| Physical phone, Wi‑Fi | `http://YOUR_LAN_IP:4000` (`npm run dev` already binds `0.0.0.0`) |

`care_fe` must be able to reach the CARE API from the phone (`REACT_CARE_API_URL` / URL map). Emulator: `http://10.0.2.2:<api-port>`.

```bash
CAPACITOR_SERVER_URL=http://10.0.2.2:4000 npx cap sync android
# Android Studio: File → Open → care_fe/android
# or: cd android && ./gradlew assembleDebug
```

Sideload `android/app/build/outputs/apk/debug/app-debug.apk`. Allow Install unknown apps.

### Checklist

1. OTP login → Home shows **Upcoming doses**. Copy should say alarms are set on this device.
2. Allow notifications, exact alarms, and full-screen intents when prompted.
3. Lock the phone. At the next `scheduled_at` (or a dose a minute ahead) the full-screen UI appears.
4. Taken / Skip / Snooze `POST`s `/api/care_reminders/alarms/{external_id}/…`. Check Django.
5. Two medicines with the same morning clock → **one** ring, both names, **Take all** marks both `taken`.
6. Reboot; the next dose still rings.
7. Profile → sign out; alarms are cleared.
8. Browser Home still lists doses and does not ring.

If alarms are late on a real OEM phone, exempt CARE from battery optimisation. No per-vendor code in v1.

## Layout

- JS: `src/Utils/capacitorAlarm.ts` (already called from `PatientAppShell`)
- Overlay sources: `native/android-alarm/`
- Generated Gradle app: `android/` (Capacitor). Re-run `apply-android-alarm.sh` after `cap add`.
