"""
altn · YouTube Media Downloader & Importer for DaVinci Resolve
Launches the standalone Altn Media Downloader application.
"""
import os
import subprocess
import sys

def main():
    possible_paths = [
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Altn_MediaDownloader\Altn_MediaDownloader.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\Altn_MediaDownloader\Altn_MediaDownloader.exe"),
        os.path.expandvars(r"%APPDATA%\Altn_MediaDownloader\Altn_MediaDownloader.exe"),
        os.path.expandvars(r"%PROGRAMFILES%\Altn_MediaDownloader\Altn_MediaDownloader.exe"),
        os.path.expandvars(r"%PROGRAMFILES(X86)%\Altn_MediaDownloader\Altn_MediaDownloader.exe"),
        # macOS paths
        "/Applications/Altn_YouTube_Downloader_Installer.app/Contents/MacOS/Altn_YouTube_Downloader_Installer",
        os.path.expanduser("~/Applications/Altn_YouTube_Downloader_Installer.app/Contents/MacOS/Altn_YouTube_Downloader_Installer"),
    ]

    for exe_path in possible_paths:
        if os.path.exists(exe_path):
            if sys.platform == "win32":
                subprocess.Popen([exe_path], close_fds=True)
            else:
                subprocess.Popen([exe_path])
            return

if __name__ == "__main__":
    main()
