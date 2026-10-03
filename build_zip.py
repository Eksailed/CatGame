import os
import zipfile

ZIP_NAME = "game.zip"

INCLUDE_EXTS = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".json"}
INCLUDE_FILES = {"index.html", "style.css", "promo_banner.jpg"}
INCLUDE_DIRS = {"lib", "js", "assets"}

def build_zip():
    print(f"Building {ZIP_NAME} for Yandex Games...")
    count = 0
    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as z:
        for file in INCLUDE_FILES:
            if os.path.exists(file):
                z.write(file, file)
                print(f"Added: {file}")
                count += 1
                
        for d in INCLUDE_DIRS:
            if os.path.exists(d):
                for root, _, files in os.walk(d):
                    for f in files:
                        ext = os.path.splitext(f)[1].lower()
                        if ext in INCLUDE_EXTS:
                            full_path = os.path.join(root, f)
                            rel_path = os.path.relpath(full_path, ".")
                            z.write(full_path, rel_path)
                            print(f"Added: {rel_path}")
                            count += 1

    size_kb = os.path.getsize(ZIP_NAME) / 1024
    print(f"\nDone! {count} files packed into {ZIP_NAME} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    build_zip()
