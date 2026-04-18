export const GROUND = {
    HEIGHT: 40,
    NOISE_INTENSITY: 35,
    COLOR_VARIATION: {
        r: 1,
        g: 0.6,
        b: 0.4
    }
};

export const GRASS = {
    INTERACTION_RADIUS: 140,
    MOUSE_FORCE: 22,
    WIND_MULTIPLIER: 10,
    BEND_FACTOR: 0.05,
    BASE_HEIGHT: 10
};

export const BLADE = {
    BASE_THICKNESS: 1.8,
    THICKNESS_VARIATION: 5
};

export const LAYERS = [
    { speed: 0.6, density: 0.45, shade: 1.35, alpha: 0.25 },
    { speed: 1.0, density: 0.9,  shade: 1.0,  alpha: 0.7 },
    { speed: 1.4, density: 1.4,  shade: 0.85, alpha: 1.0 }
];