import os
import sys
import shutil

# Default Download Directory
HOME = os.path.expanduser("~")
DOWNLOAD_DIR = os.path.join(HOME, "Movies", "DaVinci_YouTube_Downloader")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Application directory (works in dev, frozen onedir, or frozen onefile)
if getattr(sys, 'frozen', False):
    APP_DIR = os.path.dirname(sys.executable)
else:
    APP_DIR = os.path.dirname(os.path.abspath(__file__))

# Find FFmpeg binary
FFMPEG_PATH = shutil.which("ffmpeg")
if not FFMPEG_PATH:
    bundled_ffmpeg = os.path.join(APP_DIR, "ffmpeg.exe") if sys.platform == "win32" else os.path.join(APP_DIR, "ffmpeg")
    if os.path.exists(bundled_ffmpeg):
        FFMPEG_PATH = bundled_ffmpeg
    elif os.path.exists("/opt/homebrew/bin/ffmpeg"):
        FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"
    elif os.path.exists("/usr/local/bin/ffmpeg"):
        FFMPEG_PATH = "/usr/local/bin/ffmpeg"

# Find YT-DLP binary
YTDLP_PATH = shutil.which("yt-dlp")
if not YTDLP_PATH:
    bundled_ytdlp = os.path.join(APP_DIR, "yt-dlp.exe") if sys.platform == "win32" else os.path.join(APP_DIR, "yt-dlp")
    venv_ytdlp = os.path.join(os.path.dirname(__file__), "..", "..", "venv", "bin", "yt-dlp")
    if os.path.exists(bundled_ytdlp):
        YTDLP_PATH = bundled_ytdlp
    elif os.path.exists(venv_ytdlp):
        YTDLP_PATH = os.path.abspath(venv_ytdlp)
    elif os.path.exists("/opt/homebrew/bin/yt-dlp"):
        YTDLP_PATH = "/opt/homebrew/bin/yt-dlp"
