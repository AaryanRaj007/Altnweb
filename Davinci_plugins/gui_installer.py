import sys
import os
import shutil
import platform
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout,
    QLabel, QPushButton, QMessageBox
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

class InstallerWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("altn · YouTube Importer Setup")
        self.setFixedSize(520, 320)
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #121214;
                color: #e0e0e6;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
            }
        """)

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setContentsMargins(28, 28, 28, 28)
        layout.setSpacing(16)

        title = QLabel("altn · YouTube Media Importer")
        title.setFont(QFont("Inter", 20, QFont.Weight.Bold))
        title.setStyleSheet("color: #ffe000; letter-spacing: -0.5px;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)

        subtitle = QLabel("DaVinci Resolve Studio Integration")
        subtitle.setFont(QFont("Inter", 12))
        subtitle.setStyleSheet("color: #888894; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)

        desc = QLabel(
            "Installs the Live YouTube Importer plugin directly into DaVinci Resolve.\n"
            "Open via Workspace -> Scripts -> Edit inside DaVinci Resolve."
        )
        desc.setStyleSheet("color: #b0b0ba; font-size: 13px; line-height: 1.5;")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.btn_install = QPushButton("INSTALL PLUGIN TO DAVINCI RESOLVE")
        self.btn_install.setCursor(Qt.CursorShape.PointingHandCursor)
        self.btn_install.setStyleSheet("""
            QPushButton {
                background-color: #ffe000;
                color: #16150f;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: 0.5px;
                padding: 14px;
                border-radius: 4px;
                border: none;
            }
            QPushButton:hover {
                background-color: #ffd400;
            }
        """)
        self.btn_install.clicked.connect(self.run_installation)

        self.status_label = QLabel("")
        self.status_label.setStyleSheet("color: #777782; font-size: 11px;")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        layout.addWidget(title)
        layout.addWidget(subtitle)
        layout.addWidget(desc)
        layout.addStretch()
        layout.addWidget(self.btn_install)
        layout.addWidget(self.status_label)

    def run_installation(self):
        system = platform.system()
        home = os.path.expanduser("~")

        if system == "Darwin":
            target_dirs = [
                os.path.join(home, "Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Edit"),
                os.path.join(home, "Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Comp"),
                os.path.join(home, "Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Utility")
            ]
        elif system == "Windows":
            appdata = os.environ.get("APPDATA", os.path.join(home, "AppData", "Roaming"))
            programdata = os.environ.get("PROGRAMDATA", "C:\\ProgramData")
            target_dirs = [
                os.path.join(appdata, "Blackmagic Design", "DaVinci Resolve", "Support", "Fusion", "Scripts", "Edit"),
                os.path.join(appdata, "Blackmagic Design", "DaVinci Resolve", "Support", "Fusion", "Scripts", "Comp"),
                os.path.join(appdata, "Blackmagic Design", "DaVinci Resolve", "Support", "Fusion", "Scripts", "Utility"),
                os.path.join(programdata, "Blackmagic Design", "DaVinci Resolve", "Fusion", "Scripts", "Edit"),
                os.path.join(programdata, "Blackmagic Design", "DaVinci Resolve", "Fusion", "Scripts", "Utility")
            ]
        else:
            QMessageBox.critical(self, "Error", f"Unsupported Operating System: {system}")
            return

        base_dir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
        source_plugin = os.path.join(base_dir, "YouTubeDownloader")

        if not os.path.exists(source_plugin):
            source_plugin = os.path.abspath(os.path.join(os.path.dirname(__file__), "YouTubeDownloader"))

        if not os.path.exists(source_plugin):
            QMessageBox.critical(self, "Error", f"Plugin source files not found at:\n{source_plugin}")
            return

        try:
            # Detect cross-platform python executable dynamically
            if system == "Windows":
                python_exe = sys.executable.replace("\\", "/")
            else:
                python_exe = sys.executable

            pyside_main = os.path.join(source_plugin, "main.py").replace("\\", "/")

            for t_dir in target_dirs:
                os.makedirs(t_dir, exist_ok=True)
                launcher = os.path.join(t_dir, "Altn_YouTube_LiveBrowser.py")
                with open(launcher, "w") as f:
                    f.write(f"""import os, subprocess
cmd = [r"{python_exe}", r"{pyside_main}"]
subprocess.Popen(cmd)
""")

            QMessageBox.information(
                self,
                "Installation Complete",
                "Altn YouTube Media Importer plugin installed successfully.\n\n"
                "To open inside DaVinci Resolve:\n"
                "Workspace -> Scripts -> Edit -> Altn_YouTube_LiveBrowser"
            )
            self.close()

        except Exception as e:
            QMessageBox.critical(self, "Installation Error", f"Failed to install plugin launcher:\n{str(e)}")

def main():
    app = QApplication(sys.argv)
    window = InstallerWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
