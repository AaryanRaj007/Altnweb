import os
import sys
import shutil

# Default Download Directory
HOME = os.path.expanduser("~")
DOWNLOAD_DIR = os.path.join(HOME, "Movies", "DaVinci_YouTube_Downloader")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Find FFmpeg binary
FFMPEG_PATH = shutil.which("ffmpeg")
if not FFMPEG_PATH:
    if os.path.exists("/opt/homebrew/bin/ffmpeg"):
        FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"
    elif os.path.exists("/usr/local/bin/ffmpeg"):
        FFMPEG_PATH = "/usr/local/bin/ffmpeg"

# Find YT-DLP binary
VENV_YTDLP = os.path.join(os.path.dirname(__file__), "..", "..", "venv", "bin", "yt-dlp")
if os.path.exists(VENV_YTDLP):
    YTDLP_PATH = os.path.abspath(VENV_YTDLP)
else:
    YTDLP_PATH = shutil.which("yt-dlp")
    if not YTDLP_PATH and os.path.exists("/opt/homebrew/bin/yt-dlp"):
        YTDLP_PATH = "/opt/homebrew/bin/yt-dlp"
