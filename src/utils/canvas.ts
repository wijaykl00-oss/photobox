import blobbyFrameImg from '@/item/The Blobby Frame.png';

const drawFlower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  petalColor: string,
  centerColor: string
) => {
  ctx.save();
  ctx.translate(x, y);

  // Draw 5 petals
  ctx.fillStyle = petalColor;
  const numPetals = 5;
  const petalRadius = size * 0.36;
  const centerRadius = size * 0.3;

  for (let i = 0; i < numPetals; i++) {
    const angle = (i * 2 * Math.PI) / numPetals - Math.PI / 2;
    const petalX = Math.cos(angle) * (size * 0.25);
    const petalY = Math.sin(angle) * (size * 0.25);

    ctx.beginPath();
    ctx.arc(petalX, petalY, petalRadius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Draw flower center
  ctx.beginPath();
  ctx.arc(0, 0, centerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = centerColor;
  ctx.fill();

  ctx.restore();
};

const drawLeaf = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  angleDegrees: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDegrees * Math.PI) / 180);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.quadraticCurveTo(size / 2, -size / 4, 0, size / 2);
  ctx.quadraticCurveTo(-size / 2, -size / 4, 0, -size / 2);
  ctx.fill();

  ctx.restore();
};

export const downloadStrip = async (
  photos: string[], 
  bgColor: string, 
  textColor: string,
  frameStyle: 'classic' | 'blobby' | 'minimal' = 'classic'
) => {
  if (photos.length === 0) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 4:3 Aspect Ratio for photos
  const pxWidth = 600;
  const pxHeight = 450;
  const paddingSide = 48;   // Wider side borders
  const paddingTop = 48;    // Wider top border
  const gap = 24;           // Gap between photos
  const paddingBottom = 160; // Wider bottom border for text and flowers

  canvas.width = pxWidth + (paddingSide * 2);
  canvas.height = paddingTop + (pxHeight * 4) + (gap * 3) + paddingBottom;

  // Fill background
  if (frameStyle === 'blobby') {
    const blobbyImg = new Image();
    blobbyImg.src = blobbyFrameImg;
    await new Promise((resolve) => {
      blobbyImg.onload = resolve;
      blobbyImg.onerror = resolve; // Continue even if one fails
    });
    ctx.drawImage(blobbyImg, 0, 0, canvas.width, canvas.height);
  } else {
    // Fill background with color or gradient
    if (bgColor.includes('gradient') || bgColor.includes('linear-gradient') || bgColor.includes('#decbe4') || bgColor.includes('#ffd8a8') || bgColor.includes('#d7fdec')) {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (bgColor.includes('#decbe4') || bgColor.includes('bubblegum')) {
        grad.addColorStop(0, '#ffc9c9');
        grad.addColorStop(1, '#decbe4');
      } else if (bgColor.includes('#ffd8a8') || bgColor.includes('sunset') || bgColor.includes('Sunset')) {
        grad.addColorStop(0, '#ffe3e3');
        grad.addColorStop(1, '#ffd8a8');
      } else if (bgColor.includes('#d7fdec') || bgColor.includes('blobby') || bgColor.includes('Blobby')) {
        grad.addColorStop(0, '#d7fdec');
        grad.addColorStop(1, '#ffebf0');
      } else {
        grad.addColorStop(0, '#fbcfe8');
        grad.addColorStop(1, '#cfe2ff');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Draw photos iteratively
  for (let i = 0; i < photos.length; i++) {
    const img = new Image();
    img.src = photos[i];
    
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // Continue even if one fails
    });
    
    const y = paddingTop + (i * pxHeight) + (i * gap);
    ctx.drawImage(img, paddingSide, y, pxWidth, pxHeight);

    // Inner shadow/border for dimension
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddingSide, y, pxWidth, pxHeight);
  }

  // Ensure custom fonts are loaded in the browser before rendering to canvas
  try {
    await document.fonts.ready;
  } catch (e) {
    console.warn("Could not wait for fonts to load:", e);
  }

  // Draw Decorative Flowers & Leaves (only in classic style)
  if (frameStyle === 'classic') {
    // 1. Top-Left: Pink Flower & Leaf
    drawFlower(ctx, 36, 36, 50, "#ffb6c1", "#ffd700");
    drawLeaf(ctx, 72, 28, 36, "#a8e6cf", 45);

    // 2. Top-Right: Cream Flower
    drawFlower(ctx, canvas.width - 36, 36, 44, "#fffdd0", "#ffb6c1");

    // 3. Left Edge (between photo 2 and 3)
    drawFlower(ctx, 24, 984, 40, "#b3cde3", "#ffffff");

    // 4. Right Edge (between photo 3 and 4)
    drawFlower(ctx, canvas.width - 24, 1458, 44, "#decbe4", "#ffd700");
    drawLeaf(ctx, canvas.width - 56, 1450, 32, "#a8e6cf", -45);

    // 5. Bottom left flower next to text
    drawFlower(ctx, 75, canvas.height - 90, 48, "#ffb6c1", "#ffd700");

    // 6. Bottom right flower and leaf next to text
    drawFlower(ctx, canvas.width - 75, canvas.height - 85, 42, "#fffdd0", "#ffb6c1");
    drawLeaf(ctx, canvas.width - 115, canvas.height - 85, 34, "#a8e6cf", 90);
  }

  // Draw Blobby Mascot if selected (only in classic/minimal mode if they pick the Blobby color swatch, not if the entire frame is Blobby Frame!)
  if (frameStyle !== 'blobby' && (bgColor.includes('d7fdec') || bgColor.includes('blobby') || bgColor.includes('Blobby'))) {
    const blobbyImg = new Image();
    blobbyImg.src = blobbyFrameImg;
    await new Promise((resolve) => {
      blobbyImg.onload = resolve;
      blobbyImg.onerror = resolve;
    });
    // Draw peeking Blobby mascot at the bottom-right corner
    const mascotSize = 170;
    ctx.drawImage(blobbyImg, canvas.width - mascotSize + 25, canvas.height - mascotSize + 15, mascotSize, mascotSize);
  }

  // Draw Text / Branding
  ctx.fillStyle = frameStyle === 'blobby' ? '#86198f' : textColor;
  ctx.font = 'italic bold 52px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Dapinoy', canvas.width / 2, canvas.height - 85);

  ctx.font = '20px "Inter", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(
    new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 
    canvas.width / 2, 
    canvas.height - 45
  );

  // Trigger Download Event
  const link = document.createElement('a');
  link.download = `photobox-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
