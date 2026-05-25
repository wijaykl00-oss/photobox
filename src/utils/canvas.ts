export const downloadStrip = async (photos: string[], bgColor: string, textColor: string) => {
  if (photos.length === 0) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 4:3 Aspect Ratio for photos
  const pxWidth = 600;
  const pxHeight = 450;
  const padding = 24;
  const topPadding = 24;
  const bottomPadding = 140;

  canvas.width = pxWidth + (padding * 2);
  canvas.height = topPadding + (pxHeight * 4) + (padding * 3) + bottomPadding;

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
    
    const y = topPadding + (i * pxHeight) + (i * padding);
    ctx.drawImage(img, padding, y, pxWidth, pxHeight);

    // Inner shadow/border for dimension
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, y, pxWidth, pxHeight);
  }

  // Draw Text / Branding
  ctx.fillStyle = textColor;
  ctx.font = 'bold 44px "Space Grotesk", ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PHOTOBOX', canvas.width / 2, canvas.height - 75);

  ctx.font = '22px "Inter", ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(
    new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 
    canvas.width / 2, 
    canvas.height - 35
  );

  // Trigger Download Event
  const link = document.createElement('a');
  link.download = `photobox-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
