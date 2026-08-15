import sys
import os

def get_resolve_instance():
    """Obtain DaVinci Resolve Scripting API instance"""
    if "resolve" in globals() and globals()["resolve"] is not None:
        return globals()["resolve"]
    try:
        import DaVinciResolveScript as bmd
        return bmd.scriptapp("Resolve")
    except ImportError:
        pass
    expected_path = "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules"
    if os.path.exists(expected_path) and expected_path not in sys.path:
        sys.path.append(expected_path)
        try:
            import DaVinciResolveScript as bmd
            return bmd.scriptapp("Resolve")
        except ImportError:
            pass
    return None

def import_to_mediapool(file_paths):
    """Import media file(s) directly to active DaVinci Resolve Media Pool"""
    if isinstance(file_paths, str):
        file_paths = [file_paths]
        
    resolve = get_resolve_instance()
    if not resolve:
        print("[Resolve Bridge] DaVinci Resolve not connected. (Standalone mode)")
        return False
    
    try:
        project_manager = resolve.GetProjectManager()
        project = project_manager.GetCurrentProject()
        if not project:
            print("[Resolve Bridge] No active project open in DaVinci Resolve.")
            return False
            
        media_storage = resolve.GetMediaStorage()
        if media_storage:
            print(f"[Resolve Bridge] Adding {file_paths} to MediaPool via MediaStorage...")
            items = media_storage.AddItemsToMediaPool(file_paths)
            if items:
                print(f"[Resolve Bridge] Successfully imported: {items}")
                return True
                
        media_pool = project.GetMediaPool()
        if media_pool:
            items = media_pool.ImportMedia(file_paths)
            print(f"[Resolve Bridge] Imported via MediaPool: {items}")
            return True
            
    except Exception as e:
        print(f"[Resolve Bridge] Error importing files: {e}")
        return False

    return False
