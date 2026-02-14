import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const SRC_DIR = 'src/assets/wallpapers';
const THUMB_DIR = 'public/thumbs';
const FULL_DIR = 'public/wallpapers';
const THUMB_WIDTH = 600;
const THUMB_QUALITY = 80;

async function generate() {
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(FULL_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) =>
    /\.(png|jpe?g)$/i.test(f)
  );

  console.log(`Processing ${files.length} wallpapers...`);

  for (const file of files) {
    const src = join(SRC_DIR, file);
    const name = basename(file, extname(file));
    const thumbPath = join(THUMB_DIR, `${name}.webp`);
    const fullPath = join(FULL_DIR, file);

    // Generate WebP thumbnail
    await sharp(src)
      .resize({ width: THUMB_WIDTH })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);

    // Copy original to public
    await copyFile(src, fullPath);

    console.log(`  ${file} → thumb + copy`);
  }

  console.log('Done!');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
