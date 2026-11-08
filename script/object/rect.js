import Color from "../config/color.js";
import Collision from "../core/collision.js";

export default class Rect {
    constructor(p, x, y) {
        this.p = p;
        this.x = x;
        this.y = y;

        this.baseSize = 20;

        this.object = {
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (0.0025 + Math.random() * 0.005) * (Math.random() < 0.5 ? -1 : 1),
            speed: 0.5,
            minSpeed: 0.1 + Math.random() * 0.15,
            health : 50,
            armor  : 50,
            power  : 30,
            penetration : 10,
            deceleration: 0.005,
            size: 20,
            recoil: 1,
            regeneration: 0,
            zoom: 1.5,
        }

        const direction = Math.random() * Math.PI * 2;
        const speed = this.object.speed;

        this.rx = Math.cos(direction) * speed;
        this.ry = Math.sin(direction) * speed;

        this.id = crypto.randomUUID();
        this.level = 1;
        this.exp = 0;
        this.totalExp = 20;

        this.active = true;
        this.invincible = 0;
        this.color = Color.pink;

        this.collision = new Collision();
    }

    run(wallManager, target) {
        if (this.invincible > 0) {
            this.invincible--;
        }

        this.object.angle += this.object.rotationSpeed;

        this.heel();

        this.move(wallManager, target);
    }

    draw() {
        const p = this.p;

        this.drawHealth();

        p.push();
        p.translate(
            this.x + this.object.size / 2,
            this.y + this.object.size / 2
        );
        p.rotate(this.object.angle);

        p.rectMode(p.CENTER);
        p.stroke(this.color.border);
        p.strokeWeight(2);
        p.fill(this.color.fill);
        p.rect(0, 0, this.object.size, this.object.size);

        p.pop();
    }

    move(wallManager, target) {
        const px = this.x;
        const py = this.y;

        if (target) {
            const dx = target.x + target.width / 2
                - (this.x + this.object.size / 2);

            const dy = target.y + target.height / 2
                - (this.y + this.object.size / 2);

            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                this.x += (dx / distance) * this.object.minSpeed;
                this.y += (dy / distance) * this.object.minSpeed;
            }
        }

        this.x += this.rx;

        if (
            this.collision.outsideRect(this.get()) ||
            wallManager.checkRect(this.get())
        ) {
            this.x = px;
            this.rx *= -1;
        }

        this.y += this.ry;

        if (
            this.collision.outsideRect(this.get()) ||
            wallManager.checkRect(this.get())
        ) {
            this.y = py;
            this.ry *= -1;
        }

        const speed = Math.hypot(this.rx, this.ry);

        if (speed > this.object.minSpeed) {
            const nextSpeed = Math.max(
                this.object.minSpeed,
                speed - this.object.deceleration
            );

            const rate = nextSpeed / speed;

            this.rx *= rate;
            this.ry *= rate;
        }
    }

    setDirection(dx, dy, recoil = 0) {
        const distance = Math.hypot(dx, dy);

        if (distance === 0) return;

        const currentSpeed = Math.hypot(this.rx, this.ry);

        const speed = Math.max(
            this.object.minSpeed,
            Math.min(
                this.object.speed,
                currentSpeed + recoil
            )
        );

        this.rx = (dx / distance) * speed;
        this.ry = (dy / distance) * speed;
    }

    hit(target) {
        if (target.class === 'tank') {
            if (this.invincible > 0) return false;
            this.invincible = 15;

            this.setDirection(
                this.x + this.object.size / 2 - target.x,
                this.y + this.object.size / 2 - target.y,
                target.recoil
            );
        }

        if (target.class === 'object') {
            if (this.invincible > 0) return false;
            this.invincible = 15;

            this.setDirection(
                this.x + this.object.size / 2 - target.x,
                this.y + this.object.size / 2 - target.y,
                target.recoil
            );
        }

        if (target.class === 'bullet') {
            this.rx += Math.cos(target.angle) * target.recoil;
            this.ry += Math.sin(target.angle) * target.recoil;
            this.rx = Math.max(-this.object.speed, Math.min(this.rx, this.object.speed));
            this.ry = Math.max(-this.object.speed, Math.min(this.ry, this.object.speed));
        }

        this.object.health -= target.power;
        this.object.regeneration = 300;

        return this.object.health <= 0;
    }

    heel() {
        if (this.object.health >= this.object.armor) {
            this.object.health = this.object.armor;
            return;
        }

        if (this.object.regeneration > 0) {
            this.object.regeneration--;
            return;
        }

        this.object.health = Math.min(
            this.object.armor,
            this.object.health + 0.1
        );
    }

    getRequiredExp() {
        return 100 + this.level * 25;
    }

    kill(target) {
        if (target.class === 'object') {
            this.object.health = Math.min(
                this.object.armor,
                this.object.health * 2
            );
        }

        if (target.class === 'tank') {
            this.object.health = Math.min(
                this.object.armor,
                this.object.health * 2
            );
        }

        this.exp += target.totalExp;
        this.totalExp += target.totalExp;

        while (this.exp >= this.getRequiredExp()) {
            this.exp -= this.getRequiredExp();
            this.levelUp();
        }
    }

    death(target) {
        this.active = false;
    }

    levelUp() {
        this.level++;
        this.object.armor += 10;
        this.object.power += 2;
        this.object.penetration += 1;
        this.object.health += 10;
        this.object.size = this.baseSize + ((this.level - 1) * 1);
    }

    drawHealth() {
        if (this.object.health >= this.object.armor) return;

        const p = this.p;

        const width = Math.sqrt(
            this.object.size ** 2 + this.object.size ** 2
        );
        const height = 4;

        const maxHealth = this.object.armor;
        const healthRate = Math.max(
            0,
            Math.min(1, this.object.health / maxHealth)
        );

        const x = this.x + this.object.size / 2 - width / 2;
        const y = this.y + this.object.size + 8;

        p.push();

        p.noStroke();

        p.fill(Color.health.back);
        p.rect(x, y, width, height);

        p.fill(Color.health.fill);
        p.rect(x, y, width * healthRate, height);

        p.pop();
    }

    get() {
        return {
            id: this.id,
            class: 'object',
            x: this.x,
            y: this.y,
            angle: this.angle,
            recoil: this.object.recoil,
            width: this.object.size,
            height: this.object.size,
            active: this.active,
            speed: this.object.speed,
            power: this.object.power,
            armor: this.object.armor,
            penetration : this.object.penetration,
            level: this.level,
            exp: this.exp,
            totalExp: this.totalExp,
            requiredExp: this.getRequiredExp(),
            zoom: this.object.zoom,
        }
    }


}