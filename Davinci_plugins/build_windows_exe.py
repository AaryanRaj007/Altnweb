import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PLUGIN_DIR = os.path.join(BASE_DIR, "YouTubeDownloader")
INSTALLER_PY = os.path.join(BASE_DIR, "gui_installer.py")
VENV_PYINSTALLER = os.path.abspath(os.path.join(BASE_DIR, "..", "venv", "bin", "pyinstaller"))

if not os.path.exists(VENV_PYINSTALLER):
    VENV_PYINSTALLER = "pyinstaller"

print("Building Windows Executable Installer...")
print(f"Source: {PLUGIN_DIR}")

cmd = [
    VENV_PYINSTALLER,
    "-y",
    "--onefile",
    "--windowed",
    "--name=Altn_YouTube_Downloader_Installer",
    f"--add-data={PLUGIN_DIR};YouTubeDownloader",
    INSTALLER_PY
]

print("Executing PyInstaller command for Windows:", " ".join(cmd))
res = subprocess.run(cmd, cwd=BASE_DIR)

if res.returncode == 0:
    print(f"\n✅ Windows Installer Executable Built Successfully!")
else:
    print(f"\n❌ PyInstaller Windows build failed with exit code {res.returncode}")
