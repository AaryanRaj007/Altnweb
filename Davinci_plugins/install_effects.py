"""
altn · DaVinci Resolve Effects Installer
Deploys Fusion macro effect templates to the correct Resolve directories.
"""
import os
import sys
import shutil
import platform


def get_effects_dir():
    """Return the Fusion Templates/Edit/Effects directory for the current OS."""
    system = platform.system()
    home = os.path.expanduser("~")

    if system == "Darwin":
        return os.path.join(
            home,
            "Library", "Application Support",
            "Blackmagic Design", "DaVinci Resolve",
            "Fusion", "Templates", "Edit", "Effects"
        )
    elif system == "Windows":
        appdata = os.environ.get("APPDATA", os.path.join(home, "AppData", "Roaming"))
        return os.path.join(
            appdata,
            "Blackmagic Design", "DaVinci Resolve",
            "Support", "Fusion", "Templates", "Edit", "Effects"
        )
    else:
        # Linux
        return os.path.join(
            home, ".local", "share",
            "DaVinciResolve", "Fusion", "Templates", "Edit", "Effects"
        )


def install_effects():
    """Copy all .setting files from the Effects/ directory to Resolve."""
    # Locate the Effects source directory
    if getattr(sys, 'frozen', False):
        source_dir = os.path.join(os.path.dirname(sys.executable), "Effects")
    else:
        source_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Effects")

    if not os.path.isdir(source_dir):
        print(f"Effects source directory not found: {source_dir}")
        return False

    effects_dest = os.path.join(get_effects_dir(), "altn")
    os.makedirs(effects_dest, exist_ok=True)

    installed = []
    for fname in os.listdir(source_dir):
        if fname.endswith(".setting"):
            src = os.path.join(source_dir, fname)
            dst = os.path.join(effects_dest, fname)
            shutil.copy2(src, dst)
            installed.append(fname)

    return installed


if __name__ == "__main__":
    result = install_effects()
    if result:
        print(f"Installed {len(result)} effect(s) to DaVinci Resolve:")
        for f in result:
            print(f"  ✓ {f}")
        print("\nRestart DaVinci Resolve, then find effects in:")
        print("  Edit Page → Effects Panel → altn")
    else:
        print("No effects found to install.")
