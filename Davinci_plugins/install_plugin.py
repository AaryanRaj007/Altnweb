import os
import sys
import shutil
import platform

def install():
    system = platform.system()
    home = os.path.expanduser("~")
    
    if system == "Darwin":  # macOS
        target_dir = os.path.join(
            home,
            "Library", "Application Support", "Blackmagic Design",
            "DaVinci Resolve", "Support", "Developer", "Scripting", "Scripts", "Utility"
        )
    elif system == "Windows":
        appdata = os.environ.get("APPDATA", os.path.join(home, "AppData", "Roaming"))
        target_dir = os.path.join(
            appdata,
            "Blackmagic Design", "DaVinci Resolve", "Support",
            "Developer", "Scripting", "Scripts", "Utility"
        )
    else:
        print(f"Unsupported operating system: {system}")
        return

    source_plugin_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "YouTubeDownloader"))
    if not os.path.exists(source_plugin_dir):
        print(f"Plugin source directory not found at: {source_plugin_dir}")
        return

    os.makedirs(target_dir, exist_ok=True)
    dest_plugin_dir = os.path.join(target_dir, "YouTubeDownloader")

    print(f"Installing Altn YouTube Downloader Plugin...")
    print(f"Source: {source_plugin_dir}")
    print(f"Target: {dest_plugin_dir}")

    if os.path.exists(dest_plugin_dir):
        shutil.rmtree(dest_plugin_dir)

    shutil.copytree(source_plugin_dir, dest_plugin_dir)
    
    # Also create a launcher runner in Utility root for DaVinci Resolve script menu display
    launcher_file = os.path.join(target_dir, "AltnYouTubeDownloader.py")
    with open(launcher_file, "w") as f:
        f.write(f'''import sys, os
plugin_path = os.path.join(os.path.dirname(__file__), "YouTubeDownloader")
if plugin_path not in sys.path:
    sys.path.insert(0, plugin_path)
import main
main.main()
''')

    print("\n✅ Installation Successful!")
    print(f"Plugin installed to DaVinci Resolve Script Utility menu.")
    print("Open DaVinci Resolve -> Workspace -> Scripts -> Utility -> AltnYouTubeDownloader")

if __name__ == "__main__":
    install()
