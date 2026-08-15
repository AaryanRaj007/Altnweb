import sys
import os

from PySide6.QtCore import QUrl, Qt
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLineEdit, QProgressBar, QLabel, QComboBox, QMessageBox
)
from PySide6.QtWebEngineWidgets import QWebEngineView

sys.path.insert(0, os.path.dirname(__file__))

from config import DOWNLOAD_DIR
from downloader import DownloadThread
from resolve_bridge import import_to_mediapool

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("altn · YouTube Media Importer")
        self.resize(1080, 720)

        # Pin float on top of DaVinci Resolve UI
        self.setWindowFlags(self.windowFlags() | Qt.WindowStaysOnTopHint)

        # Studio-grade high-contrast dark theme
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #121214;
                color: #e0e0e6;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
            }
            QLineEdit {
                background-color: #1c1c20;
                color: #ffffff;
                border: 1px solid #2e2e36;
                border-radius: 4px;
                padding: 7px 12px;
                font-size: 13px;
            }
            QLineEdit:focus {
                border: 1px solid #ffe000;
            }
            QPushButton {
                background-color: #24242a;
                color: #e0e0e6;
                border: 1px solid #32323c;
                border-radius: 4px;
                padding: 7px 14px;
                font-size: 12px;
                font-weight: 500;
            }
            QPushButton:hover {
                background-color: #303038;
                border-color: #50505e;
            }
            QComboBox {
                background-color: #1c1c20;
                color: #ffffff;
                border: 1px solid #2e2e36;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
            }
            QComboBox::drop-down {
                border: none;
                width: 20px;
            }
            QProgressBar {
                background-color: #1c1c20;
                border: 1px solid #2e2e36;
                border-radius: 2px;
                text-align: center;
                color: #ffffff;
                font-size: 10px;
                font-weight: 600;
            }
            QProgressBar::chunk {
                background-color: #ffe000;
            }
        """)

        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(10)

        # Navigation Bar
        top_bar = QHBoxLayout()
        top_bar.setSpacing(6)

        self.home_btn = QPushButton("HOME")
        self.back_btn = QPushButton("◄")
        self.forward_btn = QPushButton("►")
        self.reload_btn = QPushButton("RELOAD")
        self.url_bar = QLineEdit()
        self.url_bar.setPlaceholderText("Paste YouTube URL or search query...")

        top_bar.addWidget(self.home_btn)
        top_bar.addWidget(self.back_btn)
        top_bar.addWidget(self.forward_btn)
        top_bar.addWidget(self.reload_btn)
        top_bar.addWidget(self.url_bar)
        layout.addLayout(top_bar)

        # Embedded Web View
        self.web_view = QWebEngineView()
        self.web_view.setUrl(QUrl("https://www.youtube.com"))
        layout.addWidget(self.web_view, stretch=1)

        # Bottom Bar Controls
        bottom_bar = QHBoxLayout()
        bottom_bar.setSpacing(12)

        lbl_preset = QLabel("FORMAT:")
        lbl_preset.setStyleSheet("color: #888894; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;")

        self.quality_combo = QComboBox()
        self.quality_combo.addItems([
            "Video + Audio (Merged MP4)",
            "Video Only (Muted MP4)",
            "Audio Only (MP3)",
            "Separate Tracks (Video & Audio)"
        ])

        self.download_btn = QPushButton("IMPORT TO MEDIA POOL")
        self.download_btn.setStyleSheet("""
            QPushButton {
                background-color: #ffe000;
                color: #16150f;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: 0.5px;
                padding: 9px 24px;
                border-radius: 4px;
                border: none;
            }
            QPushButton:hover {
                background-color: #ffd400;
            }
            QPushButton:disabled {
                background-color: #383842;
                color: #666672;
            }
        """)

        bottom_bar.addWidget(lbl_preset)
        bottom_bar.addWidget(self.quality_combo)
        bottom_bar.addStretch()
        bottom_bar.addWidget(self.download_btn)
        layout.addLayout(bottom_bar)

        # Status & Progress
        self.status_label = QLabel(f"Target Directory: {DOWNLOAD_DIR}")
        self.status_label.setStyleSheet("color: #777782; font-size: 11px;")
        self.progress_bar = QProgressBar()
        self.progress_bar.setValue(0)
        self.progress_bar.setFixedHeight(6)
        self.progress_bar.setVisible(False)

        layout.addWidget(self.status_label)
        layout.addWidget(self.progress_bar)

        # Signals
        self.home_btn.clicked.connect(self.go_home)
        self.back_btn.clicked.connect(self.web_view.back)
        self.forward_btn.clicked.connect(self.web_view.forward)
        self.reload_btn.clicked.connect(self.web_view.reload)
        self.url_bar.returnPressed.connect(self.navigate_to_url)
        self.web_view.urlChanged.connect(self.update_url_bar)
        self.download_btn.clicked.connect(self.start_download)

        self.thread = None

    def go_home(self):
        self.web_view.setUrl(QUrl("https://www.youtube.com"))

    def navigate_to_url(self):
        text = self.url_bar.text().strip()
        if not text.startswith("http://") and not text.startswith("https://"):
            text = f"https://www.youtube.com/results?search_query={text}"
        self.web_view.setUrl(QUrl(text))

    def update_url_bar(self, qurl):
        self.url_bar.setText(qurl.toString())

    def start_download(self):
        url = self.web_view.url().toString()
        if "youtube.com" not in url and "youtu.be" not in url:
            QMessageBox.warning(self, "Invalid Source", "Navigate to a YouTube video page to import.")
            return

        quality_map = {
            0: "best",
            1: "video_only",
            2: "audio_only",
            3: "separate"
        }
        selected_quality = quality_map.get(self.quality_combo.currentIndex(), "best")

        self.download_btn.setEnabled(False)
        self.progress_bar.setVisible(True)
        self.progress_bar.setValue(0)
        self.status_label.setText("Initializing download...")

        self.thread = DownloadThread(url=url, quality=selected_quality)
        self.thread.progress_signal.connect(self.on_progress)
        self.thread.finished_signal.connect(self.on_download_finished)
        self.thread.error_signal.connect(self.on_download_error)
        self.thread.start()

    def on_progress(self, percent, msg):
        self.progress_bar.setValue(int(percent))
        self.status_label.setText(msg)

    def on_download_finished(self, file_paths):
        self.download_btn.setEnabled(True)
        self.progress_bar.setVisible(False)
        
        file_names = ", ".join([os.path.basename(p) for p in file_paths])
        self.status_label.setText(f"Downloaded: {file_names}")

        imported = import_to_mediapool(file_paths)
        if imported:
            QMessageBox.information(
                self, "Import Complete",
                f"File(s) imported directly to DaVinci Resolve Media Pool:\n\n{file_names}"
            )
        else:
            QMessageBox.information(
                self, "Download Complete",
                f"File(s) downloaded to:\n{DOWNLOAD_DIR}\n\nFiles:\n{file_names}"
            )

    def on_download_error(self, err):
        self.download_btn.setEnabled(True)
        self.progress_bar.setVisible(False)
        self.status_label.setText(f"Error: {err}")
        QMessageBox.critical(self, "Download Failed", f"Failed to download:\n{err}")

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
