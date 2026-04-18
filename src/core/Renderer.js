import { shade } from '../utils/color.js';
import { noise } from '../utils/noise.js';
import { GROUND, GRASS, BLADE } from '../config.js';

export function renderScene(ctx, state) {
    const { width, height, layers, mouse, wind, colors, time } = state;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawGround(ctx, width, height, colors.ground);
    drawGrass(ctx, width, height, layers, mouse, wind, colors.grass, time);
}

/* ---------------- GROUND ---------------- */

function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function drawGround(ctx, width, height, groundColor) {
    const baseY = height - GROUND.HEIGHT;
    const { r: baseR, g: baseG, b: baseB } = hexToRgb(groundColor);

    for (let y = 0; y < GROUND.HEIGHT; y++) {
        for (let x = 0; x < width; x++) {

            const n = noise(x, y);
            const v = n * GROUND.NOISE_INTENSITY;

            const r = baseR + v * GROUND.COLOR_VARIATION.r;
            const g = baseG + v * GROUND.COLOR_VARIATION.g;
            const b = baseB + v * GROUND.COLOR_VARIATION.b;

            ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
            ctx.fillRect(x, baseY + y, 1, 1);
        }
    }
}

/* ---------------- GRASS ---------------- */

function drawGrass(ctx, width, height, layers, mouse, wind, grassColor, time) {
    const baseY = height - GROUND.HEIGHT;
    const radius = GRASS.INTERACTION_RADIUS;
    const mouseDy = height - mouse.y;

    for (const layer of layers) {
        for (const b of layer.blades) {

            const mouseDx = b.x - mouse.x;

            const dist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

            const windEffect = Math.sin(time * b.speed + b.phase) * wind;

            let mouseEffect = 0;
            if (dist < radius) {
                mouseEffect = (1 - dist / radius) * GRASS.MOUSE_FORCE * (mouseDx / radius);
            }

            const bend = b.baseAngle + windEffect * GRASS.WIND_MULTIPLIER + mouseEffect;

            const tipX = b.x + Math.sin(bend * GRASS.BEND_FACTOR) * b.height;            const tipY = baseY - b.height;

            drawBlade(
                ctx,
                b.x,
                baseY,
                tipX,
                tipY,
                b.thickness,
                shade(grassColor, b.shade)
            );
        }
    }
}

/* ---------------- BLADE ---------------- */

function drawBlade(ctx, baseX, baseY, tipX, tipY, thickness, color) {
    const dx = tipX - baseX;
    const dy = tipY - baseY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    ctx.beginPath();
    ctx.moveTo(baseX - nx, baseY - ny);
    ctx.lineTo(baseX + nx * thickness, baseY + ny * thickness);
    ctx.lineTo(tipX, tipY);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    const gradient = ctx.createLinearGradient(baseX, baseY, tipX, tipY);
    gradient.addColorStop(0, "rgba(0,0,0,0.15)");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "rgba(255,255,255,0.15)");

    ctx.fillStyle = gradient;
    ctx.fill();
}