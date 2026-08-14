#!/usr/bin/env bash
# Overlay CARE alarm Kotlin + resources onto a Capacitor android/ project.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/native/android-alarm"
APP="$ROOT/android/app/src/main"
PKG="$APP/java/network/ohc/carepatient"

if [[ ! -d "$ROOT/android" ]]; then
  echo "android/ is missing. Run: npx cap add android" >&2
  exit 1
fi

mkdir -p "$PKG/alarm" "$APP/res/layout" "$APP/res/values" "$APP/res/drawable" "$APP/res/xml"

cp "$SRC/DoseAlarm.kt" "$PKG/alarm/"
cp "$SRC/AlarmSlots.kt" "$PKG/alarm/"
cp "$SRC/AlarmStore.kt" "$PKG/alarm/"
cp "$SRC/AlarmScheduler.kt" "$PKG/alarm/"
cp "$SRC/AlarmReceiver.kt" "$PKG/alarm/"
cp "$SRC/AlarmNotifier.kt" "$PKG/alarm/"
cp "$SRC/DoseActionClient.kt" "$PKG/alarm/"
cp "$SRC/AlarmPermissions.kt" "$PKG/alarm/"
cp "$SRC/BootReceiver.kt" "$PKG/alarm/"
cp "$SRC/AlarmPlugin.kt" "$PKG/alarm/"
cp "$SRC/AlarmActivity.kt" "$PKG/"
cp "$SRC/CarePatientApplication.kt" "$PKG/"
cp "$SRC/activity_alarm.xml" "$APP/res/layout/"
cp "$SRC/alarm_dose_row.xml" "$APP/res/layout/"
cp "$SRC/colors.xml" "$APP/res/values/care_alarm_colors.xml"
cp "$SRC/themes.xml" "$APP/res/values/care_alarm_themes.xml"
cp "$SRC/ic_launcher.xml" "$APP/res/drawable/"
cp "$SRC/network_security_config.xml" "$APP/res/xml/"

cat > "$APP/res/values/colors.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#0f766e</color>
    <color name="colorPrimaryDark">#115e59</color>
    <color name="colorAccent">#0f766e</color>
</resources>
EOF

cat > "$APP/res/drawable/splash.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/colorPrimary" />
</layer-list>
EOF

python3 - "$SRC/strings.xml" "$APP/res/values/strings.xml" <<'PY'
import re
import sys
from pathlib import Path

src_text = Path(sys.argv[1]).read_text()
dest_path = Path(sys.argv[2])
entries = re.findall(r'<string name="([^"]+)">(.*?)</string>', src_text, flags=re.S)
dest = dest_path.read_text() if dest_path.exists() else "<resources>\n</resources>\n"
for name, value in entries:
    pattern = rf'    <string name="{re.escape(name)}">.*?</string>\n'
    line = f'    <string name="{name}">{value}</string>\n'
    if re.search(pattern, dest, flags=re.S):
        dest = re.sub(pattern, line, dest, count=1, flags=re.S)
    else:
        dest = dest.replace("</resources>", line + "</resources>")
dest_path.write_text(dest)
print(f"merged {len(entries)} strings into {dest_path}")
PY

cat > "$PKG/MainActivity.kt" <<'EOF'
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
EOF
rm -f "$PKG/MainActivity.java"

python3 - "$APP/AndroidManifest.xml" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
perms = [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.VIBRATE",
    "android.permission.WAKE_LOCK",
    "android.permission.RECEIVE_BOOT_COMPLETED",
    "android.permission.SCHEDULE_EXACT_ALARM",
    "android.permission.USE_EXACT_ALARM",
    "android.permission.USE_FULL_SCREEN_INTENT",
]
for perm in perms:
    tag = f'    <uses-permission android:name="{perm}" />\n'
    if perm not in text:
        text = text.replace("<application", tag + "\n    <application", 1)

if 'android:name=".CarePatientApplication"' not in text:
    text = text.replace(
        "<application",
        '<application\n        android:name=".CarePatientApplication"',
        1,
    )
if "android:networkSecurityConfig" not in text:
    text = text.replace(
        "<application",
        '<application\n        android:networkSecurityConfig="@xml/network_security_config"',
        1,
    )
if 'android:usesCleartextTraffic="true"' not in text:
    text = text.replace(
        "<application",
        '<application\n        android:usesCleartextTraffic="true"',
        1,
    )

activity = '''
        <activity
            android:name=".AlarmActivity"
            android:excludeFromRecents="true"
            android:exported="false"
            android:launchMode="standard"
            android:showWhenLocked="true"
            android:theme="@style/Theme.CarePatient.Alarm"
            android:turnScreenOn="true" />

        <receiver
            android:name=".alarm.AlarmReceiver"
            android:exported="false" />

        <receiver
            android:name=".alarm.BootReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
'''
if ".AlarmActivity" not in text:
    text = text.replace("</application>", activity + "    </application>")
path.write_text(text)
print(f"patched {path}")
PY

python3 - "$ROOT/android/build.gradle" "$ROOT/android/app/build.gradle" "$ROOT/android/variables.gradle" <<'PY'
from pathlib import Path
import sys

root_gradle, app_gradle, variables = map(Path, sys.argv[1:])

root = root_gradle.read_text()
if "kotlin-gradle-plugin" not in root:
    root = root.replace(
        "classpath 'com.google.gms:google-services:4.4.2'",
        "classpath 'com.google.gms:google-services:4.4.2'\n        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.21'",
    )
    root_gradle.write_text(root)

app = app_gradle.read_text()
if "kotlin-android" not in app:
    app = app.replace(
        "apply plugin: 'com.android.application'\n",
        "apply plugin: 'com.android.application'\napply plugin: 'kotlin-android'\n",
    )
if "compileOptions" not in app:
    app = app.replace(
        "    buildTypes {",
        """    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    buildTypes {""",
    )
app_gradle.write_text(app)

vars_text = variables.read_text()
vars_text = vars_text.replace("minSdkVersion = 23", "minSdkVersion = 28")
variables.write_text(vars_text)
print("patched Gradle for Kotlin + minSdk 28")
PY

echo "Applied CARE alarm overlay."
