import { LitElement as e, css as t, html as n } from "lit";
//#region src/themes/themes.js
function r(e) {
	switch (e) {
		case "autumn": return {
			grass: "#d7a86e",
			ground: "#4e342e"
		};
		case "spring": return {
			grass: "#85da28",
			ground: "#543825"
		};
		case "summer": return {
			grass: "#009134",
			ground: "#5d130a"
		};
		case "winter": return {
			grass: "#bdf0ff",
			ground: "#b1d8e0"
		};
		case "neon": return {
			grass: "#00ffcc",
			ground: "#11266a"
		};
		case "lilac": return {
			grass: "#cc9fed",
			ground: "#81b3a0"
		};
		case "desert": return {
			grass: "#DBD2B6",
			ground: "#f0edce"
		};
		default: return {
			grass: "#81c784",
			ground: "#3e2723"
		};
	}
}
//#endregion
//#region src/config.js
var i = {
	HEIGHT: 40,
	NOISE_INTENSITY: 35,
	COLOR_VARIATION: {
		r: 1,
		g: .6,
		b: .4
	}
}, a = {
	INTERACTION_RADIUS: 140,
	MOUSE_FORCE: 22,
	WIND_MULTIPLIER: 10,
	BEND_FACTOR: .05,
	BASE_HEIGHT: 10
}, o = {
	BASE_THICKNESS: 1.8,
	THICKNESS_VARIATION: 5
}, s = [
	{
		speed: .6,
		density: .45,
		shade: 1.35,
		alpha: .25
	},
	{
		speed: 1,
		density: .9,
		shade: 1,
		alpha: .7
	},
	{
		speed: 1.4,
		density: 1.4,
		shade: .85,
		alpha: 1
	}
];
//#endregion
//#region src/core/SceneBuilder.js
function c({ width: e, height: t, density: n, tile: r }) {
	let i = Math.ceil(e / r);
	return s.map((e) => {
		let t = [], s = Math.floor(n * e.density);
		for (let n = 0; n < i; n++) for (let i = 0; i < s; i++) t.push({
			x: n * r + Math.random() * r,
			height: a.BASE_HEIGHT + Math.random() ** 1.7 * 90,
			baseAngle: (Math.random() - .5) * 10,
			phase: Math.random() * 10,
			speed: e.speed,
			shade: e.shade,
			thickness: o.BASE_THICKNESS + Math.random() * o.THICKNESS_VARIATION
		});
		return { blades: t };
	});
}
//#endregion
//#region src/utils/color.js
function l(e, t) {
	let n = parseInt(e.replace("#", ""), 16), r = n >> 16 & 255, i = n >> 8 & 255, a = n & 255;
	return r *= t, i *= t, a *= t, `rgb(${r | 0},${i | 0},${a | 0})`;
}
//#endregion
//#region src/utils/noise.js
function u(e, t) {
	let n = e * 374761393 + t * 668265263 + 2654435769;
	return n = (n ^ n >> 13) * 1274126177, ((n ^ n >> 16) >>> 0) / 4294967295;
}
//#endregion
//#region src/core/Renderer.js
function d(e, t) {
	let { width: n, height: r, layers: i, mouse: a, wind: o, colors: s, time: c } = t;
	e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n, r), p(e, n, r, s.ground), m(e, n, r, i, a, o, s.grass, c);
}
function f(e) {
	return {
		r: parseInt(e.slice(1, 3), 16),
		g: parseInt(e.slice(3, 5), 16),
		b: parseInt(e.slice(5, 7), 16)
	};
}
function p(e, t, n, r) {
	let a = n - i.HEIGHT, { r: o, g: s, b: c } = f(r);
	for (let n = 0; n < i.HEIGHT; n++) for (let r = 0; r < t; r++) {
		let t = u(r, n) * i.NOISE_INTENSITY, l = o + t * i.COLOR_VARIATION.r, d = s + t * i.COLOR_VARIATION.g, f = c + t * i.COLOR_VARIATION.b;
		e.fillStyle = `rgb(${l | 0},${d | 0},${f | 0})`, e.fillRect(r, a + n, 1, 1);
	}
}
function m(e, t, n, r, o, s, c, u) {
	let d = n - i.HEIGHT, f = a.INTERACTION_RADIUS, p = n - o.y;
	for (let t of r) for (let n of t.blades) {
		let t = n.x - o.x, r = Math.sqrt(t * t + p * p), i = Math.sin(u * n.speed + n.phase) * s, m = 0;
		r < f && (m = (1 - r / f) * a.MOUSE_FORCE * (t / f));
		let g = n.baseAngle + i * a.WIND_MULTIPLIER + m, _ = n.x + Math.sin(g * a.BEND_FACTOR) * n.height, v = d - n.height;
		h(e, n.x, d, _, v, n.thickness, l(c, n.shade));
	}
}
function h(e, t, n, r, i, a, o) {
	let s = r - t, c = i - n, l = Math.sqrt(s * s + c * c), u = -c / l, d = s / l;
	e.beginPath(), e.moveTo(t - u, n - d), e.lineTo(t + u * a, n + d * a), e.lineTo(r, i), e.closePath(), e.fillStyle = o, e.fill();
	let f = e.createLinearGradient(t, n, r, i);
	f.addColorStop(0, "rgba(0,0,0,0.15)"), f.addColorStop(.5, o), f.addColorStop(1, "rgba(255,255,255,0.15)"), e.fillStyle = f, e.fill();
}
//#endregion
//#region src/components/GrassFloor.js
var g = class extends e {
	static properties = {
		density: {
			type: Number,
			reflect: !0
		},
		wind: {
			type: Number,
			reflect: !0
		},
		theme: {
			type: String,
			reflect: !0
		},
		tile: {
			type: Number,
			reflect: !0
		}
	};
	static styles = t`
        :host {
            display: block;
            position: relative;
            height: 140px;
            overflow: hidden;
        }

        canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
    `;
	constructor() {
		super(), this.density = 40, this.wind = 1, this.theme = "forest", this.tile = 40, this.mouse = {
			x: -9999,
			y: -9999
		}, this.width = 0, this.height = 0, this.layers = [], this.timeOffset = Math.random() * 1e3, this._running = !1, this._raf = null;
	}
	_validateProps() {
		this.density = Math.max(0, Number(this.density) || 0), this.wind = Number(this.wind) || 0, this.tile = Math.max(1, Number(this.tile) || 1), typeof this.theme != "string" && (this.theme = "forest");
	}
	willUpdate(e) {
		this._validateProps(), (e.has("density") || e.has("wind") || e.has("tile") || e.has("theme")) && this._initScene();
	}
	connectedCallback() {
		super.connectedCallback(), this._onMouseMove = this._onMouseMove.bind(this), window.addEventListener("mousemove", this._onMouseMove, { passive: !0 });
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("mousemove", this._onMouseMove), this._stop(), this._observer?.disconnect();
	}
	firstUpdated() {
		this.canvas = this.shadowRoot.querySelector("canvas"), this.ctx = this.canvas.getContext("2d"), this._observeResize(), this.width || this._resizeCanvas(300, 150), this._initScene(), this._start();
	}
	_resizeCanvas(e, t) {
		this.width = e, this.height = t, this.canvas.width = e, this.canvas.height = t;
	}
	_observeResize() {
		this._observer = new ResizeObserver(([e]) => {
			let { width: t, height: n } = e.contentRect;
			this._resizeCanvas(t, n), this._initScene();
		}), this._observer.observe(this);
	}
	_applyTheme() {
		let { grass: e, ground: t } = r(this.theme);
		this.grassColor = e, this.groundColor = t;
	}
	_initScene() {
		this._applyTheme(), !(!this.width || !this.height) && (this.layers = c({
			width: this.width,
			height: this.height,
			density: this.density,
			tile: this.tile
		}));
	}
	_render() {
		if (!this.ctx || !this.layers?.length || !this.width || !this.height || !this.grassColor || !this.groundColor) return;
		let e = performance.now() / 1e3 + this.timeOffset;
		d(this.ctx, {
			width: this.width,
			height: this.height,
			layers: this.layers,
			mouse: this.mouse,
			wind: this.wind,
			colors: {
				grass: this.grassColor,
				ground: this.groundColor
			},
			time: e
		});
	}
	_start() {
		this._raf || this._loop();
	}
	_stop() {
		cancelAnimationFrame(this._raf), this._raf = null;
	}
	_loop = () => {
		this._render(), this._raf = requestAnimationFrame(this._loop);
	};
	pause() {
		this._stop();
	}
	play() {
		this._start();
	}
	_onMouseMove(e) {
		let t = this.getBoundingClientRect();
		this.mouse.x = e.clientX - t.left, this.mouse.y = e.clientY - t.top;
	}
	render() {
		return n`<canvas></canvas>`;
	}
};
customElements.define("grass-floor", g);
//#endregion
export { g as GrassFloor };
