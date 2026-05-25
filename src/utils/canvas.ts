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

export const downloadStrip = async (photos: string[], bgColor: string, textColor: string) => {
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
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  // Draw Decorative Flowers & Leaves
  // 1. Top-Left: Pink Flower & Leaf
  drawFlower(ctx, 36, 36, 50, "#ffb6c1", "#ffd700");
  drawLeaf(ctx, 72, 28, 36, "#a8e6cf", 45);

  // 2. Top-Right: Cream Flower
  drawFlower(ctx, canvas.width - 36, 36, 44, "#fffdd0", "#ffb6c1");

  // 3. Left Edge (between photo 2 and 3)
  // Photo 2 starts at paddingTop + pxHeight + gap = 48 + 450 + 24 = 522. Ends at 972.
  // Center of gap is 984.
  drawFlower(ctx, 24, 984, 40, "#b3cde3", "#ffffff");

  // 4. Right Edge (between photo 3 and 4)
  // Photo 3 starts at paddingTop + (2 * pxHeight) + (2 * gap) = 48 + 900 + 48 = 996. Ends at 1446.
  // Center of gap is 1458.
  drawFlower(ctx, canvas.width - 24, 1458, 44, "#decbe4", "#ffd700");
  drawLeaf(ctx, canvas.width - 56, 1450, 32, "#a8e6cf", -45);

  // 5. Bottom left flower next to text
  drawFlower(ctx, 75, canvas.height - 90, 48, "#ffb6c1", "#ffd700");

  // 6. Bottom right flower and leaf next to text
  drawFlower(ctx, canvas.width - 75, canvas.height - 85, 42, "#fffdd0", "#ffb6c1");
  drawLeaf(ctx, canvas.width - 115, canvas.height - 85, 34, "#a8e6cf", 90);

  // Draw Text / Branding
  ctx.fillStyle = textColor;
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
