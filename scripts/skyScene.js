export class SkyScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.resize();
        window.addEventListener("resize", () => this.resize());

        this.time = 0;
        this.wind = 0.3;     // 0 — штиль, 1 — буря
        this.clouds = [];
        this.trees = [];

        this.initClouds();
        this.initTrees();

        requestAnimationFrame((t) => this.render(t));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
    }

    // ---------------- CLOUDS ----------------
    initClouds() {
        for (let i = 0; i < 7; i++) {
            this.clouds.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h * 0.4,
                size: 80 + Math.random() * 150,
                speed: 0.2 + Math.random() * 0.5
            });
        }
    }

    drawCloud(ctx, x, y, size) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // пушистость
        ctx.beginPath();
        ctx.ellipse(x + size * 0.6, y - size * 0.2, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(x - size * 0.6, y - size * 0.3, size * 0.7, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // ---------------- TREES ----------------
    initTrees() {
        for (let i = 0; i < 12; i++) {
            this.trees.push({
                x: (i / 12) * this.w,
                swayOffset: Math.random() * 1000,
                height: 120 + Math.random() * 100
            });
        }
    }

    drawTree(ctx, x, baseY, sway, height) {
        ctx.fillStyle = "#2c3e13";
        ctx.save();
        ctx.translate(x + sway, baseY);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-height * 0.3, -height);
        ctx.lineTo(height * 0.3, -height);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // ---------------- RENDER ----------------
    render(t) {
        this.time = t * 0.001;
        const ctx = this.ctx;

        // градиент неба
        const g = ctx.createLinearGradient(0, 0, 0, this.h);
        g.addColorStop(0, "#6ec8ff");
        g.addColorStop(1, "#dff6ff");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.w, this.h);

        // солнце
        const sunY = this.h * 0.25 + Math.sin(this.time * 0.2) * 20;
        ctx.beginPath();
        ctx.fillStyle = "#ffdf6e";
        ctx.arc(this.w * 0.8, sunY, 60, 0, Math.PI * 2);
        ctx.fill();

        // облака
        for (const c of this.clouds) {
            c.x += (c.speed + this.wind) * 0.5;
            if (c.x > this.w + 200) c.x = -200;
            this.drawCloud(ctx, c.x, c.y, c.size);
        }

        // сосны
        const baseY = this.h - 80;
        for (const tObj of this.trees) {
            const sway = Math.sin(this.time * 2 + tObj.swayOffset) * 8 * this.wind;
            this.drawTree(ctx, tObj.x, baseY, sway, tObj.height);
        }

        requestAnimationFrame((tt) => this.render(tt));
    }
}
