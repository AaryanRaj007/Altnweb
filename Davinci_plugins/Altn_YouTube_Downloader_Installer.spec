# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['gui_installer.py'],
    pathex=[],
    binaries=[],
    datas=[('YouTubeDownloader', 'YouTubeDownloader')],
    hiddenimports=['PySide6.QtWebEngineWidgets', 'PySide6.QtWebEngineCore', 'PySide6.QtWebChannel'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='Altn_YouTube_Downloader_Installer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
app = BUNDLE(
    exe,
    name='Altn_YouTube_Downloader_Installer.app',
    icon=None,
    bundle_identifier=None,
)
