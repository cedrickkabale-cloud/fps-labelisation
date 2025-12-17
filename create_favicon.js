const fs = require('fs');

// Create a simple 16x16 32-bit BMP (DIB) and pack into ICO container
const w = 16, h = 16;
const headerSize = 14; // not used in ICO DIB - we write BITMAPINFOHEADER directly
const dibHeaderSize = 40;
const pixelBytes = w * h * 4;
const dibSize = dibHeaderSize + pixelBytes; // no mask

function writeUInt32LE(buf, value, offset) { buf.writeUInt32LE(value, offset); }
function writeUInt16LE(buf, value, offset) { buf.writeUInt16LE(value, offset); }

// Build BITMAPINFOHEADER
const dib = Buffer.alloc(dibSize);
// biSize
writeUInt32LE(dib, dibHeaderSize, 0);
// biWidth
writeUInt32LE(dib, w, 4);
// biHeight -> for ICO BMP, height = imageHeight * 2 (including mask), but mask omitted for 32bpp
writeUInt32LE(dib, h * 2, 8);
// biPlanes
writeUInt16LE(dib, 1, 12);
// biBitCount
writeUInt16LE(dib, 32, 14);
// biCompression
writeUInt32LE(dib, 0, 16);
// biSizeImage
writeUInt32LE(dib, pixelBytes, 20);
// biXPelsPerMeter, biYPelsPerMeter
writeUInt32LE(dib, 0, 24);
writeUInt32LE(dib, 0, 28);
// biClrUsed, biClrImportant
writeUInt32LE(dib, 0, 32);
writeUInt32LE(dib, 0, 36);

// Fill pixel data (bottom-up rows). We'll draw a blue background and a simple white "F" shape.
const pixelOffset = dibHeaderSize;
for (let row = 0; row < h; row++) {
  const y = row; // top-to-bottom in our loop, but BMP stores bottom-to-top
  const destRow = h - 1 - y; // destination row index
  for (let col = 0; col < w; col++) {
    const i = pixelOffset + (destRow * w + col) * 4;
    // default blue color #0b5ed7 (B G R)
    let b = 0xd7; let g = 0x5e; let r = 0x0b; let a = 0xff;
    // Draw a simple 'F' in white using approximate pixel map
    // Vertical bar at cols 2..3, rows 2..13
    if ((col === 2 || col === 3) && (row >= 2 && row <= 13)) { r = 255; g = 255; b = 255; }
    // Top horizontal bar at rows 2..3, cols 2..10
    if ((row === 2 || row === 3) && (col >= 2 && col <= 10)) { r = 255; g = 255; b = 255; }
    // Middle horizontal bar at rows 7..8, cols 2..8
    if ((row === 7 || row === 8) && (col >= 2 && col <= 8)) { r = 255; g = 255; b = 255; }
    dib[i + 0] = b;
    dib[i + 1] = g;
    dib[i + 2] = r;
    dib[i + 3] = a;
  }
}

// Build ICO header and directory
// ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes) + image data
const iconDirSize = 6;
const iconEntrySize = 16;
const imageOffset = iconDirSize + iconEntrySize;
const imageSize = dib.length;

const ico = Buffer.alloc(imageOffset + imageSize);
// ICONDIR
ico.writeUInt16LE(0, 0); // reserved
ico.writeUInt16LE(1, 2); // type = 1 (icon)
ico.writeUInt16LE(1, 4); // count
// ICONDIRENTRY
ico.writeUInt8(w === 256 ? 0 : w, 6); // width (0 means 256)
ico.writeUInt8(h === 256 ? 0 : h, 7); // height
ico.writeUInt8(0, 8); // color count
ico.writeUInt8(0, 9); // reserved
ico.writeUInt16LE(1, 10); // planes
ico.writeUInt16LE(32, 12); // bit count
ico.writeUInt32LE(imageSize, 14); // bytes in resource
ico.writeUInt32LE(imageOffset, 18); // image offset

// Copy image (DIB) after headers
dib.copy(ico, imageOffset);

// Ensure public directory exists
const outDir = __dirname + '/public';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outPath = outDir + '/favicon.ico';
fs.writeFileSync(outPath, ico);
console.log('Created', outPath, 'size', ico.length);
