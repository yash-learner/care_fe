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

| Where the app runs    | `CAPACITOR_SERVER_URL`                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Android emulator      | `http://10.0.2.2:4000` (default)                                                               |
| Physical phone, USB   | `http://127.0.0.1:4000` plus `adb reverse tcp:4000 tcp:4000` and reverse the CARE API port too |
| Physical phone, Wi‑Fi | `http://YOUR_LAN_IP:4000` (`npm run dev` already binds `0.0.0.0`)                              |

`care_fe` must be able to reach the CARE API from the phone (`REACT_CARE_API_URL` / URL map). Emulator: `http://10.0.2.2:<api-port>`.

```bash
CAPACITOR_SERVER_URL=http://10.0.2.2:4000 npx cap sync android
# Android Studio: File → Open → care_fe/android  (the folder next to package.json / node_modules)
# or: cd android && ./gradlew assembleDebug
```

## Windows + WSL

Windows Android Studio does **not** reliably open a Gradle project under `\\wsl$\…`. Studio’s Run button is itself a Windows Gradle build of the folder you opened, so “compile in WSL, Run in Studio on the WSL tree” does not work.

Split the jobs:

| Job                                                  | Where                       |
| ---------------------------------------------------- | --------------------------- |
| `npm install`, `npm run dev`, `npx cap sync android` | WSL (`care_fe` Linux clone) |
| Gradle sync / Run / emulator / USB                   | Windows Android Studio      |
| Django / CARE API                                    | WSL                         |

Do **not** run a full `npm install` of `care_fe` on Windows. `postinstall` only fetches extra Rollup/esbuild binaries for Linux/macOS, `prepare` runs Husky, and Playwright helpers are bash. You do not need Vite on Windows; the debug APK loads `/patient/login` from the WSL dev server.

### Recommended: WSL Node + Windows Studio (no full Windows `npm install`)

**WSL** (source of truth for git + JS):

```bash
cd care_fe
git checkout cursor/patient-capacitor-alarms-4f0c
git pull
npm install
CAPACITOR_SERVER_URL=http://10.0.2.2:4000 npx cap sync android
```

**Windows** — clone the same repo onto NTFS (whole `care_fe`, not only `android/`), then install **only** Capacitor so Gradle can see `:capacitor-android`:

```powershell
cd $env:USERPROFILE\StudioProjects
git clone https://github.com/yash-learner/care_fe.git
cd care_fe
git checkout cursor/patient-capacitor-alarms-4f0c
git pull
npm install --ignore-scripts --no-save @capacitor/core @capacitor/android @capacitor/cli
npx cap sync android
```

`--ignore-scripts` skips Husky and `scripts/install-platform-deps.ts`.

Android Studio: **File → Open** → `C:\Users\<you>\StudioProjects\care_fe\android`

If you would rather not run npm on Windows at all, copy one folder from WSL after `npm install` there (dereference symlinks):

```bash
# WSL; adjust the Windows path
WIN=/mnt/c/Users/$USER/StudioProjects/care_fe
mkdir -p "$WIN/node_modules/@capacitor"
rm -rf "$WIN/node_modules/@capacitor/android"
cp -aL node_modules/@capacitor/android "$WIN/node_modules/@capacitor/"
```

Then open `$WIN/android` in Studio. Do not copy the rest of `node_modules`.

If Gradle fails with `Duplicate resources` for `drawable/splash`, Capacitor’s default `splash.png` is still next to our `splash.xml`. Delete the PNG (git will not remove an untracked local file):

```powershell
del C:\Users\yasht\StudioProjects\care_fe\android\app\src\main\res\drawable\splash.png
```

The `flatDir` warning comes from Capacitor’s Gradle templates. Ignore it; do not “Fix with AI”.

`android/capacitor-cordova-android-plugins/` is an empty Cordova shim Gradle needs even when you have no Cordova plugins. It is committed on this branch. After `git pull` on Windows it should exist; you do not copy it from WSL.

If Studio still says `Failed to resolve: project :capacitor-android`:

1. Opened path must end in `care_fe\android`, not `StudioProjects\android`.
2. `care_fe\node_modules\@capacitor\android\capacitor` must exist on NTFS.
3. File → Sync Project with Gradle Files.
4. Do not use “Fix with AI” / Project Structure for this error.

Debug WebView talks to the WSL Vite server. WSL2 usually publishes ports on Windows `localhost`, so the emulator default `http://10.0.2.2:4000` works if `npm run dev` is bound to `0.0.0.0` in WSL. Phone on Wi‑Fi: use the **Windows** LAN IP.

Keep both clones on the same git branch. After JS or `capacitor.config.ts` changes: `npx cap sync android` in WSL, `git pull` on Windows, then the small Capacitor `npm install` (or the `cp -aL`) again.

### Alternative: assemble the APK in WSL, skip Studio

That needs a **Linux** Android SDK in WSL. The SDK that Windows Studio installed is `aapt2.exe` and will not drive WSL `./gradlew`. Do not point `ANDROID_HOME` at `/mnt/c/Users/…/AppData/Local/Android/Sdk`.

If you install command-line tools + a JDK in WSL:

```bash
cd care_fe
npm install
npx cap sync android
cd android && ./gradlew assembleDebug
```

Then install with Windows `adb` (emulator or USB). Studio is optional:

```powershell
adb install -r \\wsl$\Ubuntu\home\<you>\path\to\care_fe\android\app\build\outputs\apk\debug\app-debug.apk
```

### Do not

- Open `\\wsl$\Ubuntu\home\…\care_fe\android` from Windows Android Studio.
- Full `npm install` of `care_fe` on Windows (unnecessary for the APK; can fail on Husky / Linux-only extras).
- Copy the whole WSL `node_modules` onto NTFS.
- Copy only the `android/` folder.
- Install Android Studio inside WSL just to dodge `\\wsl$`.

Sideload `android/app/build/outputs/apk/debug/app-debug.apk` (allow Install unknown apps).

### Checklist

1. OTP login → Home **Upcoming doses** is empty until you opt in.
2. Records → a prescription → **bell** to turn on reminders. Tap the **medicine name** to see upcoming / taken / skipped / missed.
3. Home **Upcoming doses** collapses; the count stays on the header.
4. Allow notifications, exact alarms, and full-screen intents when prompted.
5. Lock the phone. At the next `scheduled_at` (or a dose a minute ahead) the full-screen UI appears.
6. Taken / Skip / Snooze `POST`s `/api/care_reminders/alarms/{external_id}/…`. Check Django.
7. Two medicines with the same morning clock → **one** ring, both names, **Take all** marks both `taken`.
8. Reboot; the next dose still rings.
9. Profile → sign out; alarms are cleared.
10. Browser Home still lists doses and does not ring.

If alarms are late on a real OEM phone, exempt CARE from battery optimisation. No per-vendor code in v1.

## Layout

- JS: `src/Utils/capacitorAlarm.ts` (already called from `PatientAppShell`)
- Overlay sources: `native/android-alarm/`
- Gradle app: `android/` (committed). Only re-run `apply-android-alarm.sh` after a fresh `npx cap add android`.
