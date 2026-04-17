import { LitElement, html, css } from 'lit';
import {theme} from "../themes/themes";
import {buildLayers} from "../core/SceneBuilder";
import {renderScene} from "../core/Renderer";
const DEBUG = false;
export class GrassFloor extends LitElement {
    static properties = {
        density: { type: Number, reflect: true },
        wind: { type: Number, reflect: true },
        theme: { type: String, reflect: true },
        tile: { type: Number, reflect: true }
    };

    static styles = css`
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
        super();

        this.density = 40;
        this.wind = 1;
        this.theme = 'forest';
        this.tile = 40;

        this.mouse = { x: -9999, y: -9999 };

        this.width = 0;
        this.height = 0;

        this.layers = [];
        this.timeOffset = Math.random() * 1000;

        this._running = false;
        this._raf = null;
    }

    _validateProps() {
        this.density = Math.max(0, Number(this.density) || 0);
        this.wind = Number(this.wind) || 0;
        this.tile = Math.max(1, Number(this.tile) || 1);

        if (typeof this.theme !== 'string') {
            this.theme = 'forest';
        }
    }

    willUpdate(changed) {
        this._validateProps();

        if (
            changed.has('density') ||
            changed.has('wind') ||
            changed.has('tile') ||
            changed.has('theme')
        ) {
            this._initScene();
        }
    }

    /* =========================================================
       LIFECYCLE
    ========================================================= */

    connectedCallback() {
        super.connectedCallback();
        DEBUG && console.log('Connected Callback');
        this._onMouseMove = this._onMouseMove.bind(this);
        window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mousemove', this._onMouseMove);
        DEBUG && console.log('Disconnected Callback');
        this._stop();
        this._observer?.disconnect();
    }

    firstUpdated() {
        this.canvas = this.shadowRoot.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        this._observeResize();
        if (!this.width) {
            this._resizeCanvas(300, 150);
        }
        this._initScene();
        DEBUG && console.log('Updated for the first time!');
        this._start();
    }

    /* =========================================================
       RESIZE
    ========================================================= */
    _resizeCanvas(width, height) {
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    _observeResize() {
        this._observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            this._resizeCanvas(width, height);
            this._initScene();
        });

        this._observer.observe(this);
        DEBUG && console.log('Got observe resized...');
    }

    /* =========================================================
       SCENE SETUP
    ========================================================= */

    _applyTheme() {
        const { grass, ground } = theme(this.theme);
        this.grassColor = grass;
        this.groundColor = ground;
    }

    _initScene() {
        this._applyTheme();
        if (!this.width || !this.height) return;
        this.layers = buildLayers({
            width: this.width,
            height: this.height,
            density: this.density,
            tile: this.tile
        });

        DEBUG && console.log('Scene initialized.')
    }

    _render() {
        if (!this.ctx || !this.layers?.length || !this.width || !this.height) return;
        if (!this.grassColor || !this.groundColor) return;

        const time = performance.now() / 1000 + this.timeOffset;

        renderScene(this.ctx, {
            width: this.width,
            height: this.height,
            layers: this.layers,
            mouse: this.mouse,
            wind: this.wind,
            colors: {
                grass: this.grassColor,
                ground: this.groundColor
            },
            time
        });
    }
    /* =========================================================
       ANIMATION
    ========================================================= */

    _start() {
        if (this._raf) return;
        this._loop();
    }

    _stop() {
        cancelAnimationFrame(this._raf);
        this._raf = null;
    }

    _loop = () => {
        this._render();
        this._raf = requestAnimationFrame(this._loop);
    };

    pause() {
        this._stop();
    }

    play() {
        this._start();
    }

    /* =========================================================
       INPUT
    ========================================================= */

    _onMouseMove(e) {
        const rect = this.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    /* =========================================================
       TEMPLATE
    ========================================================= */

    render() {
        return html`<canvas></canvas>`;
    }
}

customElements.define('grass-floor', GrassFloor);