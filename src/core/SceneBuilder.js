import { LAYERS } from '../config.js';

export function buildLayers({ width, height, density, tile }) {
    const tiles = Math.ceil(width / tile);

    return LAYERS.map(config => {
        const blades = [];
        const perTile = Math.floor(density * config.density);

        for (let t = 0; t < tiles; t++) {
            for (let i = 0; i < perTile; i++) {
                blades.push({
                    x: t * tile + Math.random() * tile,
                    height: 10 + Math.pow(Math.random(), 1.7) * 90,
                    baseAngle: (Math.random() - 0.5) * 10,
                    phase: Math.random() * 10,
                    speed: config.speed,
                    shade: config.shade,
                    alpha: config.alpha,
                    thickness: 0.5 + Math.random() * 2.8
                });
            }
        }

        return { blades };
    });
}