const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const sharp = require('sharp');
    let pngToIco = require('png-to-ico');
    // Support commonjs interop where the function may be on .default or .imagesToIco
    if (pngToIco && typeof pngToIco !== 'function') {
      pngToIco = pngToIco.default || pngToIco.imagesToIco || pngToIco;
    }

    const svgPath = path.join(__dirname, 'assets', 'fps-logo.svg');
    if (!fs.existsSync(svgPath)) throw new Error('SVG source not found: ' + svgPath);

    const sizes = [16, 32, 48];
    const pngBuffers = [];

    for (const s of sizes) {
      const buf = await sharp(svgPath)
        .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      pngBuffers.push(buf);
    }

    const icoBuffer = await pngToIco(pngBuffers);
    const outDir = path.join(__dirname, 'public');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const outPath = path.join(outDir, 'favicon.ico');
    fs.writeFileSync(outPath, icoBuffer);
    console.log('Created multires favicon:', outPath, 'size=', icoBuffer.length);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
