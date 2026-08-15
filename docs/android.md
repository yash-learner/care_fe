# Patient Android APK (Capacitor + exact alarms)

The APK is `care_fe` in a WebView. It starts at **`/patient/login`**, not the staff EMR. Exact alarms are a Capacitor plugin (`Alarm.sync` / `Alarm.cancel`) ported from `care_medicine_reminder`, with same-minute medicines grouped on one lock screen.

## Morning test (debug APK)

`android/` is already on `cursor/patient-capacitor-alarms-4f0c` with the alarm overlay applied. After a pull you only need:

```bash
cd care_fe
git pull
npm install
npx cap sync android
```

`cap sync` copies Capacitor config into the Android project and points Gradle at `node_modules`. It does not create `android/` and does not rebuild the APK.

Skip `npx cap add android` and `bash scripts/apply-android-alarm.sh` unless `android/` is missing (you deleted it, or a clone never had the folder). Those two recreate the Gradle app and copy Kotlin from `native/android-alarm/`.

Point the WebView at your running patient portal. Default is the emulator host:

| Where the app runs | `CAPACITOR_SERVER_URL` |
| --- | --- |
| Android emulator | `http://10.0.2.2:4000` (default) |
| Physical phone, USB | `http://127.0.0.1:4000` plus `adb reverse tcp:4000 tcp:4000` and reverse the CARE API port too |
| Physical phone, Wi‑Fi | `http://YOUR_LAN_IP:4000` (`npm run dev` already binds `0.0.0.0`) |

`care_fe` must be able to reach the CARE API from the phone (`REACT_CARE_API_URL` / URL map). Emulator: `http://10.0.2.2:<api-port>`.

```bash
CAPACITOR_SERVER_URL=http://10.0.2.2:4000 npx cap sync android
# Android Studio: File → Open → care_fe/android  (the folder next to package.json / node_modules)
# or: cd android && ./gradlew assembleDebug
```

Do **not** copy `android/` into `C:\Users\...\StudioProjects\android` and open that copy. Capacitor is not inside the Android folder; Gradle loads it from `care_fe/node_modules/@capacitor/android`. Opening a copy makes `:capacitor-android` fail to resolve even if a Gradle run printed `BUILD SUCCESSFUL` (that success was usually from the real `care_fe/android`, or from downloading Maven jars before the IDE model failed).

If the problems report path looks like `C:/Users/…/StudioProjects/android/build/reports/…`, Studio opened the copy. Close that project. **File → Open** the folder next to `package.json`:

```text
…/care_fe/android
```

not `…/StudioProjects/android`.

If Studio still says `Failed to resolve: project :capacitor-android`:

1. Confirm the opened path ends in `care_fe/android` (WSL: `\\wsl$\…\care_fe\android` is fine; a Windows copy of only `android/` is not).
2. In `care_fe`: `npm install` then `npx cap sync android` (creates `node_modules/@capacitor/android`).
3. File → Sync Project with Gradle Files.
4. If you already imported a copy under StudioProjects, delete that Studio project from the welcome screen and open `care_fe/android` instead. Do not “Fix with AI” / Project Structure for this error.

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
- Gradle app: `android/` (committed). Only re-run `apply-android-alarm.sh` after a fresh `npx cap add android`.
