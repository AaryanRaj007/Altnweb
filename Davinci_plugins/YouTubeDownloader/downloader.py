import os
import subprocess
import re
from PySide6.QtCore import QThread, Signal
from config import YTDLP_PATH, FFMPEG_PATH, DOWNLOAD_DIR

class DownloadThread(QThread):
    progress_signal = Signal(float, str)  # percent, status message
    finished_signal = Signal(list)        # downloaded file paths list
    error_signal = Signal(str)            # error message

    def __init__(self, url, quality="best", output_dir=DOWNLOAD_DIR):
        super().__init__()
        self.url = url
        self.quality = quality
        self.output_dir = output_dir

    def run(self):
        if not YTDLP_PATH or not os.path.exists(YTDLP_PATH):
            self.error_signal.emit("yt-dlp binary not found. Please install yt-dlp.")
            return

        if self.quality == "separate":
            self.run_separate_download()
            return

        out_template = os.path.join(self.output_dir, "%(title)s-%(id)s.%(ext)s")
        cmd = [
            YTDLP_PATH,
            self.url,
            "--restrict-filenames",
            "--no-playlist",
            "--newline",
            "-o", out_template
        ]

        if FFMPEG_PATH and os.path.exists(FFMPEG_PATH):
            cmd.extend(["--ffmpeg-location", FFMPEG_PATH])

        if self.quality == "video_only":
            cmd.extend(["-f", "bestvideo[ext=mp4]/bestvideo"])
        elif self.quality == "audio_only":
            cmd.extend(["-x", "--audio-format", "mp3"])
        elif self.quality == "1080p":
            cmd.extend(["-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]", "--recode-video", "mp4"])
        else: # "best" / merged
            cmd.extend(["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "--recode-video", "mp4"])

        self.progress_signal.emit(5.0, "Starting download...")
        
        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )

            downloaded_file = None

            for line in iter(process.stdout.readline, ''):
                line = line.strip()
                if not line:
                    continue

                match = re.search(r'\[download\]\s+(\d+\.\d+)%', line)
                if match:
                    percent = float(match.group(1))
                    self.progress_signal.emit(percent, f"Downloading: {percent:.1f}%")

                if "[download] Destination:" in line:
                    downloaded_file = line.split("Destination:", 1)[1].strip()
                elif "[VideoConvertor] Merging formats into" in line:
                    downloaded_file = line.split("into", 1)[1].strip().strip('"')
                elif "[ffmpeg] Destination:" in line:
                    downloaded_file = line.split("Destination:", 1)[1].strip()

            process.wait()

            if process.returncode == 0:
                self.progress_signal.emit(100.0, "Download Complete!")
                if not downloaded_file or not os.path.exists(downloaded_file):
                    files = [os.path.join(self.output_dir, f) for f in os.listdir(self.output_dir)]
                    if files:
                        downloaded_file = max(files, key=os.path.getmtime)
                self.finished_signal.emit([downloaded_file])
            else:
                self.error_signal.emit(f"yt-dlp exited with error code {process.returncode}")

        except Exception as e:
            self.error_signal.emit(str(e))

    def run_separate_download(self):
        """Downloads video track and audio track as separate independent files"""
        out_video = os.path.join(self.output_dir, "%(title)s-%(id)s_VIDEO.%(ext)s")
        out_audio = os.path.join(self.output_dir, "%(title)s-%(id)s_AUDIO.%(ext)s")

        cmd_video = [YTDLP_PATH, self.url, "--restrict-filenames", "--no-playlist", "-f", "bestvideo[ext=mp4]/bestvideo", "-o", out_video]
        cmd_audio = [YTDLP_PATH, self.url, "--restrict-filenames", "--no-playlist", "-x", "--audio-format", "mp3", "-o", out_audio]

        if FFMPEG_PATH and os.path.exists(FFMPEG_PATH):
            cmd_video.extend(["--ffmpeg-location", FFMPEG_PATH])
            cmd_audio.extend(["--ffmpeg-location", FFMPEG_PATH])

        try:
            self.progress_signal.emit(10.0, "Downloading video track...")
            p_vid = subprocess.run(cmd_video, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            if p_vid.returncode != 0:
                self.error_signal.emit(f"Video download failed: {p_vid.stdout[:100]}")
                return

            self.progress_signal.emit(55.0, "Downloading audio track...")
            p_aud = subprocess.run(cmd_audio, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            if p_aud.returncode != 0:
                self.error_signal.emit(f"Audio download failed: {p_aud.stdout[:100]}")
                return

            self.progress_signal.emit(100.0, "Separate tracks download complete!")
            
            # Find the two latest created files
            files = [os.path.join(self.output_dir, f) for f in os.listdir(self.output_dir)]
            files.sort(key=os.path.getmtime, reverse=True)
            results = files[:2]

            self.finished_signal.emit(results)

        except Exception as e:
            self.error_signal.emit(str(e))
