export default class Bullet {
    constructor(
        p,
        x,
        y,
        vx,
        vy,
        angle,
        color,
        owner,
        name,
        config
    ) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.angle = angle;
        this.color = color;
        this.owner = owner;
        this.name = name;
        this.config = { ...config };
        this.id = crypto.randomUUID();

        this.count = 0;
        this.active = true;
        this.collisions = new Set();
    }

    run() {
        this.move();
    }

    move() {
        if (!this.active) return;

        this.x += Math.cos(this.angle) * this.config.speed + this.vx;
        this.y += Math.sin(this.angle) * this.config.speed + this.vy;

        this.count++;

        if (this.count >= this.config.range) {
            this.active = false;
            return;
        }

        if (this.count > this.config.duration) {
            this.config.speed = Math.max(0, this.config.speed - this.config.deceleration);
        }
    }

    draw() {
        const p = this.p;

        p.push();

        p.stroke(this.color.border);
        p.strokeWeight(2);
        p.fill(this.color.fill);

        p.circle(
            this.x,
            this.y,
            this.config.radius * 2,
        );

        p.pop();
    }

    hit(target) {
        if (this.collisions.has(target.id)) return false;

        this.collisions.add(target.id);

        this.config.armor -= target.penetration;

        return this.config.armor <= 0;
    }

    kill(target) {
        return true;
    }

    death(target) {
        this.active = false;
    }

    get() {
        return {
            id: this.id,
            class: 'bullet',
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            angle: this.angle,
            speed: this.config.speed,
            radius: this.config.radius,
            owner: this.owner,
            name: this.name,
            active: this.active,
            power: this.config.power,
            armor: this.config.armor,
            penetration: this.config.penetration,
            recoil: this.config.recoil,
        }
    }
}
