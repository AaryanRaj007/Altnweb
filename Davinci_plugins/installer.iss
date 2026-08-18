; Inno Setup Script for Altn Media Downloader (DaVinci Resolve)
#define MyAppName "Altn Media Downloader"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "altn"
#define MyAppURL "https://altn.tv"
#define MyAppExeName "Altn_MediaDownloader.exe"

[Setup]
AppId={{9C56A41F-69D2-4820-A033-9118D68BA239}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={localappdata}\Programs\Altn_MediaDownloader
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=dist_setup
OutputBaseFilename=Altn_YouTube_Downloader_Installer
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64
UninstallDisplayIcon={app}\{#MyAppExeName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Main application files
Source: "dist\Altn_MediaDownloader\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; DaVinci Resolve Launcher Script
Source: "Altn_MediaDownloader.py"; DestDir: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Edit"; Flags: ignoreversion
; Fusion Effect Templates (Edit page → Effects panel → altn)
Source: "Effects\*.setting"; DestDir: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates\Edit\Effects\altn"; Flags: ignoreversion

[InstallDelete]
; Deep wipe legacy and duplicate script files from all Resolve directories
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Altn_*.py"
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\YouTube_*.py"
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Edit\Altn_YouTube_*.py"
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Edit\YouTube_*.py"
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Comp\Altn_*.py"
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Utility\Altn_*.py"
Type: files; Name: "{commonappdata}\Blackmagic Design\DaVinci Resolve\Fusion\Scripts\Altn_*.py"
Type: files; Name: "{commonappdata}\Blackmagic Design\DaVinci Resolve\Fusion\Scripts\Edit\Altn_*.py"

[Icons]
Name: "{userprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: files; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Scripts\Edit\Altn_MediaDownloader.py"
Type: filesandordirs; Name: "{userappdata}\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates\Edit\Effects\altn"
