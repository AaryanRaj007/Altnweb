import { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        // Downscale resolution slightly for butter-smooth GPU performance (0.75x)
        const CELL_SIZE = 12;
        const CONTRAST = 158;
        
        let lumaMap: Float32Array;
        let cols = 0;
        let rows = 0;

        const img = new Image();
        img.src = "/bg-source.png";

        const resizeAndProcess = () => {
            const width = Math.ceil(window.innerWidth * 0.75);
            const height = Math.ceil(window.innerHeight * 0.75);
            
            canvas.width = width;
            canvas.height = height;

            cols = Math.ceil(width / CELL_SIZE);
            rows = Math.ceil(height / CELL_SIZE);
            lumaMap = new Float32Array(cols * rows);

            const offscreen = document.createElement("canvas");
            offscreen.width = width;
            offscreen.height = height;
            const offCtx = offscreen.getContext("2d");
            if (!offCtx) return;

            const imgAspect = (img.width || 1) / (img.height || 1);
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

            const imgData = offCtx.getImageData(0, 0, width, height).data;
            const contrastFactor = (259 * (CONTRAST + 255)) / (255 * (259 - CONTRAST));

            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const px = Math.min(x * CELL_SIZE + Math.floor(CELL_SIZE / 2), width - 1);
                    const py = Math.min(y * CELL_SIZE + Math.floor(CELL_SIZE / 2), height - 1);
                    const idx = (py * width + px) * 4;

                    let r = imgData[idx];
                    let g = imgData[idx + 1];
                    let b = imgData[idx + 2];

                    r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
                    g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
                    b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));

                    const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    lumaMap[x * rows + y] = luma;
                }
            }
        };

        img.onload = () => {
            resizeAndProcess();
            render(performance.now());
        };

        window.addEventListener("resize", resizeAndProcess);

        const render = (time: number) => {
            animationFrameId = requestAnimationFrame(render);

            const elapsed = time - lastTime;
            if (elapsed < FRAME_INTERVAL) return;
            lastTime = time - (elapsed % FRAME_INTERVAL);

            const width = canvas.width;
            const height = canvas.height;
            if (!width || !height) return;

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#ffffff";
            const phase = time * 0.0008;

            for (let x = 0; x < cols; x++) {
                const xOffset = x * CELL_SIZE;
                const xPhase = phase + x * 0.05;

                for (let y = 0; y < rows; y++) {
                    const luma = lumaMap[x * rows + y];
                    if (luma < 0.08) continue;
                    
                    const pulse = Math.sin(xPhase + y * 0.05) * 0.5 + 0.5;
                    const intensity = luma * (0.4 + pulse * 0.6);

                    if (intensity > 0.12) {
                        const size = CELL_SIZE * intensity * 0.85;
                        const offset = (CELL_SIZE - size) * 0.5;
                        ctx.fillRect(xOffset + offset, y * CELL_SIZE + offset, size, size);
                    }
                }
            }
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
                filter: "blur(20px)",
                opacity: 0.65,
                pointerEvents: "none",
                willChange: "transform"
            }}
        />
    );
};

export default BackgroundCanvas;
