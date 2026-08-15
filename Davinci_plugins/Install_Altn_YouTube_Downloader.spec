# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['/Users/ankitraj/Downloads/tryingsomthingdif/Davinci_plugins/gui_installer.py'],
    pathex=[],
    binaries=[],
    datas=[('/Users/ankitraj/Downloads/tryingsomthingdif/Davinci_plugins/YouTubeDownloader', 'YouTubeDownloader')],
    hiddenimports=[],
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
    name='Install_Altn_YouTube_Downloader',
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
    name='Install_Altn_YouTube_Downloader.app',
    icon=None,
    bundle_identifier=None,
)
