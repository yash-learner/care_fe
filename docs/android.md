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

## Windows + WSL

Windows Android Studio does **not** reliably open a Gradle project that lives only under `\\wsl$\…`. Do not fight that. Pick one of the paths below.

### Recommended: clone full `care_fe` on the Windows drive

Copy or clone the **whole** frontend repo (not only `android/`). Gradle needs `package.json` and `node_modules` as siblings of `android/`.

Leave Django / CARE API / `npm run dev` in WSL. You do not need to move the backend.

In **PowerShell** (Windows Node.js 20+, same branch as WSL):

```powershell
cd $env:USERPROFILE\StudioProjects
git clone https://github.com/yash-learner/care_fe.git
cd care_fe
git checkout cursor/patient-capacitor-alarms-4f0c
git pull
npm install
npx cap sync android
```

Android Studio: **File → Open** → `C:\Users\<you>\StudioProjects\care_fe\android`

Do **not** copy `android/` alone into `StudioProjects\android`. Do **not** copy `node_modules` from WSL onto NTFS (Linux symlinks break). Run `npm install` on Windows.

If Studio still says `Failed to resolve: project :capacitor-android`:

1. The opened path must end in `care_fe\android`, not `StudioProjects\android`.
2. `care_fe\node_modules\@capacitor\android\capacitor` must exist (Windows `npm install` + `npx cap sync android`).
3. File → Sync Project with Gradle Files.
4. Do not use “Fix with AI” / Project Structure for this error.

Debug WebView still talks to the WSL Vite server. WSL2 usually publishes ports on Windows `localhost`, so the emulator default `http://10.0.2.2:4000` works if `npm run dev` is bound to `0.0.0.0` in WSL. Phone on Wi‑Fi: use the **Windows** LAN IP, not the WSL internal IP.

Keep the two clones on the same git branch. Edit Kotlin in Studio on Windows; edit React in WSL or Windows, then `git pull` the other clone. `npx cap sync android` after JS or `capacitor.config.ts` changes.

### Alternative: Gradle in WSL, no Android Studio

Possible, but you still need the Android SDK, a JDK, and `adb` in WSL (or `adb.exe` on Windows). The emulator GPU path is worse in WSL2; USB devices need `usbipd`. Use this only if you already live in the Linux SDK and do not need the Studio UI.

```bash
cd care_fe
npm install
npx cap sync android
cd android && ./gradlew assembleDebug
```

Sideload `android/app/build/outputs/apk/debug/app-debug.apk`.

### Do not

- Open `\\wsl$\Ubuntu\home\…\care_fe\android` from Windows Android Studio.
- Install Android Studio inside WSL just to work around the `\\wsl$` limitation.
- Copy only the `android/` folder.

Sideload `android/app/build/outputs/apk/debug/app-debug.apk` (allow Install unknown apps).

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
