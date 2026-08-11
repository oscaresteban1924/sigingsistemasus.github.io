import asyncio, glob, os
import winrt.windows.storage as storage
import winrt.windows.storage.streams as streams
import winrt.windows.graphics.imaging as imaging
import winrt.windows.media.ocr as ocr

async def ocr_image(engine, path):
    abs_path = os.path.abspath(path)
    file = await storage.StorageFile.get_file_from_path_async(abs_path)
    stream = await file.open_async(storage.FileAccessMode.READ)
    decoder = await imaging.BitmapDecoder.create_async(stream)
    bmp = await decoder.get_software_bitmap_async()
    res = await engine.recognize_async(bmp)
    return res.text

async def main():
    engine = ocr.OcrEngine.try_create_from_user_profile_languages()
    # Filter slide images (size > 500KB)
    slides = glob.glob("scratch/semana1_slides/*.png")
    slides = [s for s in slides if os.path.getsize(s) > 500000]
    # Sort by numeric index in filename imageX.png
    slides.sort(key=lambda s: int(os.path.basename(s).replace("image", "").replace(".png", "")))

    print(f"Total slides found: {len(slides)}\n")
    
    out_file = "scratch/semana1_text.txt"
    with open(out_file, "w", encoding="utf-8") as f:
        for idx, slide_path in enumerate(slides, 1):
            text = await ocr_image(engine, slide_path)
            header = f"=== SLIDE {idx} ({os.path.basename(slide_path)}) ==="
            print(header)
            print(text)
            print("-" * 50)
            f.write(f"{header}\n{text}\n\n")

    print(f"\nExtraction complete! Saved to {out_file}")

if __name__ == "__main__":
    asyncio.run(main())
