import sys
import os

# Ensure YouTubeDownloader directory is on sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
yt_dir = os.path.join(base_dir, "YouTubeDownloader")
if yt_dir not in sys.path:
    sys.path.insert(0, yt_dir)

from YouTubeDownloader.main import main

if __name__ == "__main__":
    main()
