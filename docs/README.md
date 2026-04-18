# 🌿How Grassly  works

`grassly-component` is a `Canvas` based `lit element` that generates animated grass. It does not use DOM elements for each blade.

The system is built around three core ideas:
- Procedural generation (creating grass data once)
- Frame-based rendering (drawing every animation frame)
- Simulating natural movement (wind + mouse influence)


## Scene building
When the component is first loaded or resized, it generates a "scene"" (this happens in `SceneBuilder.js`)

What happens here:
- The screen is divided into horizontal “tiles”
- Each tile contains a number of grass blades
- Each blade is randomly generated with properties like: x-coordinate, height, baseAngle, animation phase, speed, shade, thickness.

This ensures the grass looks natural and nonrepetitive. The grass is NOT created every frame. It is created once and reused.

## Grass blade properties
Each grass blade is just an object:
- x - location of the blade on the current tile, randomized.
- height - randomized blade height.
- baseAngle - influence the angle of the blades.
- phase - makes blades move differently from the others in the same layer.
- speed - blade speed differs per layer, leave it to 1 to have uniform movement per layer.
- shade - a darker or lighter shade per layer, as shown in config.
- thickness - random blade thickness.

## Rendering Loop

The animation runs inside a continuous loop using `requestAnimationFrame()`

Each frame does:
- Clear canvas
- Draw ground
- Draw all grass blades
- Apply wind and mouse effects
- Repeat

Canvas is a stateful pixel surface, not a scene graph, but each frame redraw is still less expensive than animating even less DOM elements.

## Ground Rendering

The ground is drawn first as a textured surface. A simple noise function based on the golden ratio was selected, which generates variation. Each pixel row is slightly shifted in color
```javascript
int hash(int x, int y){   
    int h = seed + x*374761393 + y*668265263;
    h = (h^(h >> 13))*1274126177;
    return h^(h >> 16);
```

## Grass Rendering

Wind is computed with a sine wave, Math.sin(time * speed + phase) because sine creates smooth oscillation, time makes it animate continuously and phase ensures that grass blades don’t move in sync.

```javascript
const windEffect = Math.sin(time * b.speed + b.phase) * wind;

let mouseEffect = 0;
if (dist < radius) {
    mouseEffect = (1 - dist / radius) * GRASS.MOUSE_FORCE * (mouseDx / radius);
}

const bend = b.baseAngle + windEffect * GRASS.WIND_MULTIPLIER + mouseEffect;

const tipX = b.x + Math.sin(bend * GRASS.BEND_FACTOR) * b.height;
const tipY = baseY - b.height;
```
Then, each blade is drawn as a triangle shape.
```   
     tip (tipX, tipY)
           ▲
          / \
         /   \
        /_____\
 base left     base right
 ```

Starting at base position, it computes the direction vector (wind + mouse), the tip position and then draws triangle between base and tip.

````javascript
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
````
## Mouse Interaction

Mouse affects grass in a certain radius from the mouse position. First step is to measure the distance from cursor to blade. If a blade is inside the radius, the closer the grass blade, the stronger it is pushed away from the cursor.

Each blade’s final direction is a combination of the following three elements which are added together:
- base angle (random natural tilt)
- wind motion (oscillation)
- mouse force (local distortion)

## Shading System

Color is adjusted per blade using a simple shading function which lightens or darkens the base color by a factor.

```javascript
let r = (n >> 16) & 255; r *= factor;
let g = (n >> 8) & 255; g *= factor;
let b = n & 255; b *= factor;
```

Each blade received information from its layer configuration to simulate a depth of field and natural lighting:

- slight brightness variation
- slight color shift