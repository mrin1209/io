import Color from "../config/color.js";
import Collision from "../core/collision.js";
import Circle from "./shape/circle.js";
import Triangle from "./shape/triangle.js";
import Square from "./shape/square.js";
import Pentagon from "./shape/pentagon.js";
import Hexagon from "./shape/hexagon.js";
import Heptagon from "./shape/heptagon.js";
import Octagon from "./shape/octagon.js";


export default class Object {
    constructor(p, x, y) {
        this.p = p;
        this.x = x;
        this.y = y;

        this.object = {
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (0.0025 + Math.random() * 0.005) * (Math.random() < 0.5 ? -1 : 1),
            power: 5,
            speed: 0.1 + Math.random() * 0.15,
            deceleration: 0.005,
            regeneration: 0,
            zoom: 2.5,
        }

        this.shapes = [
            new Circle(p),
            new Triangle(p),
            new Square(p),
            new Pentagon(p),
            new Hexagon(p),
            new Heptagon(p),
            new Octagon(p)
        ];

        this.shapeIndex = 0;
        this.shape = this.shapes[this.shapeIndex];

        const direction = Math.random() * Math.PI * 2;
        this.rx = Math.cos(direction) * this.object.speed;
        this.ry = Math.sin(direction) * this.object.speed;

        this.id = crypto.randomUUID();
        this.level = 1;
        this.exp = 0;
        this.totalExp = 50;

        this.object.health = this.shape.armor;

        this.active = true;
        this.invincible = 0;

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
        p.translate(this.x, this.y);
        p.rotate(this.object.angle);
        p.rectMode(p.CENTER);
        p.stroke(this.shape.color.border);
        p.strokeWeight(2);
        p.fill(this.shape.color.fill);

        this.shape.draw();;

        p.pop();
    }

    move(wallManager, target) {
        const px = this.x;
        const py = this.y;

        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;

            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                this.x += (dx / distance) * this.object.speed * 1.2;
                this.y += (dy / distance) * this.object.speed * 1.2;
            }
        }

        this.x += this.rx;

        if (
            this.collision.outside(this.get()) ||
            wallManager.check(this.get())
        ) {
            this.x = px;
            this.rx *= -1;
        }

        this.y += this.ry;

        if (
            this.collision.outside(this.get()) ||
            wallManager.check(this.get())
        ) {
            this.y = py;
            this.ry *= -1;
        }

        const speed = Math.hypot(this.rx, this.ry);

        if (speed > this.object.speed) {
            const nextSpeed = Math.max(
                this.object.speed,
                speed - this.object.deceleration
            );

            const rate = nextSpeed / speed;

            this.rx *= rate;
            this.ry *= rate;
        }
    }

    hit(target) {
        if (target.class === 'bullet') {
            this.rx += Math.cos(target.angle) * target.recoil;
            this.ry += Math.sin(target.angle) * target.recoil;

            this.object.health -= target.power;
        }

        if (target.class === 'tank') {
            if (this.invincible > 0) return false;
            this.invincible = 15;

            const dx = this.x - target.x;
            const dy = this.y - target.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                this.rx += (dx / distance) * target.recoil;
                this.ry += (dy / distance) * target.recoil;
            }

            this.object.health -= target.power;
        }

        if (target.class === 'object') {
            if (this.invincible > 0) return false;
            this.invincible = 15;

            const dx = this.x - target.x;
            const dy = this.y - target.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                this.rx += (dx / distance) * target.recoil;
                this.ry += (dy / distance) * target.recoil;
            }

            this.object.health -= this.object.power;
        }

        this.object.regeneration = 300;

        return this.object.health <= 0;
    }

    heel() {
        if (this.object.health >= this.shape.armor) {
            this.object.health = this.shape.armor;
            return;
        }

        if (this.object.regeneration > 0) {
            this.object.regeneration--;
            return;
        }

        this.object.health = Math.min(
            this.shape.armor,
            this.object.health + 0.1
        );
    }

    kill(target) {
        if (target.class === 'object') {
            this.object.health = Math.min(
                this.shape.armor,
                this.object.health + target.armor
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

    getRequiredExp() {
        return 50 * Math.pow(2, this.level - 1);
    }

    levelUp() {
        this.level++;

        if (this.shapeIndex >= this.shapes.length - 1) {
            this.shape.armor += 10;
            this.shape.power += 10;
            this.shape.penetration += 10;
            this.shape.radius += 2;
        } else {
            this.object.power += 5;

            const armor = this.shape.armor;

            this.shapeIndex++;
            this.shape = this.shapes[this.shapeIndex];

            this.object.health += this.shape.armor - armor;
        }
    }

    drawHealth() {
        if (this.object.health >= this.shape.armor) return;

        const p = this.p;

        const width = this.shape.radius * 2;
        const height = 4;

        const healthRate = Math.max(
            0,
            Math.min(1, this.object.health / this.shape.armor)
        );

        const x = -width / 2;
        const y = this.shape.size / 2 + 8;

        p.push();
        p.translate(this.x, this.y);

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
            recoil: this.shape.recoil,
            radius: this.shape.radius,
            active: this.active,
            speed: this.object.speed,
            power: this.shape.power,
            armor: this.shape.armor,
            penetration : this.shape.penetration,
            level: this.level,
            exp: this.exp,
            totalExp: this.totalExp,
            requiredExp: this.getRequiredExp(),
            zoom: this.object.zoom,
        }
    }


}