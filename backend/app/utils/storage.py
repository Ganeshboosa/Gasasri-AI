import os
import shutil
from typing import BinaryIO
from pathlib import Path

class StorageProvider:
    async def upload_file(self, file: BinaryIO, filename: str, folder: str = "") -> str:
        raise NotImplementedError

    async def get_file_url(self, filename: str, folder: str = "") -> str:
        raise NotImplementedError

class LocalStorage(StorageProvider):
    def __init__(self, base_dir: str = "media"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def upload_file(self, file: BinaryIO, filename: str, folder: str = "") -> str:
        target_dir = self.base_dir / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = target_dir / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file, buffer)
        
        # Return a relative URL path that FastAPI can serve
        return f"/static/{folder}/{filename}" if folder else f"/static/{filename}"

    async def get_file_url(self, filename: str, folder: str = "") -> str:
        return f"/static/{folder}/{filename}" if folder else f"/static/{filename}"

# Factory or singleton
storage = LocalStorage()
