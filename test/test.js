import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/GrassFloor.js';

describe('GrassFloor', () => {

    it('renders a canvas element', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);
        const canvas = el.shadowRoot.querySelector('canvas');

        expect(canvas).to.exist;
    });

    it('initializes default properties', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);

        expect(el.density).to.equal(40);
        expect(el.wind).to.equal(0.1);
        expect(el.theme).to.equal('forest');
        expect(el.tile).to.equal(40);
    });

    it('creates layers after first update', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);

        await el.updateComplete;

        expect(el.layers).to.be.an('array');
    });

    it('responds to mouse movement', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);

        const event = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 50
        });

        window.dispatchEvent(event);

        expect(el.mouse.x).to.not.equal(-9999);
        expect(el.mouse.y).to.not.equal(-9999);
    });

    it('can be added to DOM like a real user would', async () => {
        const el = document.createElement('grassly-component');
        document.body.appendChild(el);

        await el.updateComplete;

        expect(el.shadowRoot.querySelector('canvas')).to.exist;
    });

    it('starts animation loop', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);

        await el.updateComplete;

        expect(el._raf).to.exist;
    });

    it('reads attributes correctly', async () => {
        const el = await fixture(html`
        <grassly-component density="55" wind="0.3" tile="20"></grassly-component>
    `);

        expect(el.density).to.equal(55);
        expect(el.wind).to.equal(0.3);
        expect(el.tile).to.equal(20);
    });

    it('updates when properties change', async () => {
        const el = await fixture(html`<grassly-component></grassly-component>`);

        await el.updateComplete;

        const oldBladeCount = el.layers?.[0]?.blades?.length ?? 0;

        el.density = 100;
        await el.updateComplete;

        const newBladeCount = el.layers?.[0]?.blades?.length ?? 0;

        expect(newBladeCount).to.be.greaterThan(0);
        expect(newBladeCount).to.not.equal(oldBladeCount);
    });

    it('clamps invalid values', async () => {
        const el = await fixture(html`
        <grassly-component density="-10" tile="0"></grassly-component>
    `);

        await el.updateComplete;

        expect(el.density).to.equal(0);
        expect(el.tile).to.be.at.least(1);
    });

    it('updates theme correctly', async () => {
        const el = await fixture(html`
        <grassly-component theme="neon"></grassly-component>
    `);

        await el.updateComplete;

        expect(el.grassColor).to.exist;
        expect(el.groundColor).to.exist;
    });
});