import { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Configuration mapped from prompt JSON
        const CELL_SIZE = 9;
        const CONTRAST = 158; // 0-200 range roughly
        
        // Pre-calculated luminance map
        let lumaMap: number[][] = [];
        let cols = 0;
        let rows = 0;

        const img = new Image();
        img.src = "/bg-source.png";

        const resizeAndProcess = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            cols = Math.ceil(width / CELL_SIZE);
            rows = Math.ceil(height / CELL_SIZE);
            lumaMap = Array(cols).fill(0).map(() => Array(rows).fill(0));

            // Offscreen canvas for sampling
            const offscreen = document.createElement("canvas");
            offscreen.width = width;
            offscreen.height = height;
            const offCtx = offscreen.getContext("2d");
            if (!offCtx) return;

            // Draw image to cover screen
            const imgAspect = img.width / img.height;
            const screenAspect = width / height;
            
            let drawW = width;
            let drawH = height;
            let drawX = 0;
            let drawY = 0;

            if (imgAspect > screenAspect) {
                drawW = height * imgAspect;
                drawX = (width - drawW) / 2;
            } else {
                drawH = width / imgAspect;
                drawY = (height - drawH) / 2;
            }

            offCtx.drawImage(img, drawX, drawY, drawW, drawH);

            // Sample image luminance
            const imgData = offCtx.getImageData(0, 0, width, height).data;
            const contrastFactor = (259 * (CONTRAST + 255)) / (255 * (259 - CONTRAST));

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const px = Math.min(x * CELL_SIZE + Math.floor(CELL_SIZE/2), width - 1);
                    const py = Math.min(y * CELL_SIZE + Math.floor(CELL_SIZE/2), height - 1);
                    const idx = (py * width + px) * 4;

                    let r = imgData[idx];
                    let g = imgData[idx + 1];
                    let b = imgData[idx + 2];

                    // Apply contrast
                    r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
                    g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
                    b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));

                    // standard luminance
                    const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    lumaMap[x][y] = luma;
                }
            }
        };

        img.onload = () => {
            resizeAndProcess();
            render(0);
        };

        window.addEventListener("resize", () => {
            resizeAndProcess();
        });

        const render = (time: number) => {
            if (!ctx) return;

            // Fill black background
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#ffffff";
            
            // "Pulse" animation phase
            const phase = time * 0.001; // Speed

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const luma = lumaMap[x][y];
                    if (luma === undefined) continue;
                    
                    // Sine wave pulse across the grid based on luma and time
                    const pulse = Math.sin(phase + (x * 0.05) + (y * 0.05)) * 0.5 + 0.5;
                    
                    // Final intensity combines the image contrast with the pulse animation
                    const intensity = Math.min(1, Math.max(0, luma * (0.4 + pulse * 0.6)));

                    // Dither mode: draw shapes (we use rects) based on intensity
                    // If intensity is very low, draw nothing.
                    if (intensity > 0.1) {
                        // For a dithered look, we vary the size of the square
                        const size = CELL_SIZE * intensity * 0.9;
                        const offset = (CELL_SIZE - size) / 2;
                        
                        // We use a slight opacity instead of pure white to give it that "Ink Garden" deep texture
                        ctx.globalAlpha = intensity;
                        ctx.fillRect(x * CELL_SIZE + offset, y * CELL_SIZE + offset, size, size);
                    }
                }
            }
            
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        return () => {
            window.removeEventListener("resize", resizeAndProcess);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                filter: "blur(30px)", 
                opacity: 0.7,
                pointerEvents: "none"
            }}
        />
    );
};

export default BackgroundCanvas;
