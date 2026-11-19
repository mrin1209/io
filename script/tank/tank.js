import Status from "../model/status.js";
import Color from "../config/color.js";
import Collision from "../core/collision.js";
import Bullet from "../bullet/bullet.js";
import Random from "../core/random.js";

export default class Tank {
    constructor(param) {
        this.collision = new Collision();
        this.random = new Random();

        this.p = param.p;
        this.x = param.x;
        this.y = param.y;
        this.angle = param.angle ?? 0;
        this.vx = 0;
        this.vy = 0;
        this.rx = 0;
        this.ry = 0;

        this.status = new Status();
        this.baseRadius = 15;

        this.tank = {
            speed  : 2,   // 移動速度
            maxSpeed: 2,   // 最大速度
            armor  : 100, // 機体体力
            power  : 25,  // 機体攻撃力
            penetration : 25, // 弾丸攻撃力
            acceleration: 1 / 60, // 機体加速率
            deceleration: 1 / 60, // 機体減速率
            zoom   : 1, // ズーム率
            radius : this.baseRadius,  // 機体半径
            regeneration: 600, // 再生時間
            heal: 0.1, // 再生力
            recoil : 1, // 接触反動
            healCount : 0,
            shotCount  : 1, // 発射間隔
        }

        this.gun = [
            {
                id: 1,
                x: 0,
                y: 0,
                angle: 0,
                shot: 0,
                reload : 60, // 連射速度
                aim    : 10, // 拡散角度
                length : 15,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.5, // 発射反動
            }
        ]

        this.bullet = [
            {
                id: 1,
                speed  : 2, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 180, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 0.5, // 着弾反動
            }
        ]

        this.id = crypto.randomUUID();
        this.level = 0;
        this.exp = 0;
        this.totalExp = 0;
        this.upgradeToken = 0;
        this.updateToken = 0;
        this.tier = 1;

        this.previewColor = Color.blue;
        this.previewScale = 1;

        this.active = true;
        this.invincible = 0;
    }

    setup(param) {
        this.baseZoom = this.tank.zoom;

        this.baseStats = {
            tank: { ...this.tank },
            gun: this.gun.map(gun => ({ ...gun })),
            bullet: this.bullet.map(bullet => ({ ...bullet })),
        };

        if (param.status) {
            this.status = param.status;

            for (const item of this.status.items) {
                const [group, property] = item.key.split(".");

                this.applyStatus(item, group, property, item.count);
            }
        }

        this.id = param.id ?? this.id;
        this.name = param.name ?? this.name;
        this.type = param.type ?? this.type;
        this.upgradeToken = param.upgradeToken ?? this.upgradeToken;
        this.updateToken = param.updateToken ?? this.updateToken;
        this.tank.healCount = param.healCount ?? this.tank.healCount;
        this.exp = param.exp ?? this.exp;
        this.totalExp = param.totalExp ?? this.totalExp;
        this.tier = param.tier ?? this.tier;
        this.previewScale = param.previewScale ?? this.previewScale;

        this.color = this.color ?? (this.type === 'player' ? Color.blue : Color.red);

        const health = param.health;

        for (let i = 0; i < (param.level ?? 0); i++) {
            this.levelUp(false);
        }

        this.tank.health = Math.min(
            health ?? this.tank.armor,
            this.tank.armor
        );
    }

    run() {
        if (!this.gun.some(gun => gun.shot <= 0)) {
            for (const gun of this.gun) {
                if (gun.shot > 0) {
                    gun.shot -= this.tank.shotCount;
                }
            }
        } else {
            for (const [i, gun] of this.gun.entries()) {
                gun.shot = this.baseStats.gun[i].shot;
            }
        }

        if (this.invincible > 0) {
            this.invincible--;
        }

        this.heal();
    }

    move(x, y, wallManager) {
        const dx = x * this.tank.speed;
        const dy = y * this.tank.speed;

        const approach = (current, target) => {
            if (current < target) {
                return Math.min(current + this.tank.acceleration, target);
            }

            if (current > target) {
                return Math.max(current - this.tank.acceleration, target);
            }

            return current;
        };

        let vx = approach(this.vx, dx);
        let vy = approach(this.vy, dy);

        if (x === 0) {
            vx = Math.abs(vx) <= this.tank.deceleration
                ? 0
                : vx - Math.sign(vx) * this.tank.deceleration;
        }

        if (y === 0) {
            vy = Math.abs(vy) <= this.tank.deceleration
                ? 0
                : vy - Math.sign(vy) * this.tank.deceleration;
        }

        const px = this.x;
        this.x += vx + this.rx;

        if (
            this.collision.outside(
                {
                    x: this.get().x,
                    y: this.get().y,
                    radius: this.baseRadius,
                }
            ) ||
            wallManager.check(
                {
                    x: this.get().x,
                    y: this.get().y,
                    radius: this.baseRadius,
                }
            )
        ) {
            this.x = px;
            vx *= -1;
            this.rx *= -1;
        }

        const py = this.y;
        this.y += vy + this.ry;

        if (
            this.collision.outside(
                {
                    x: this.get().x,
                    y: this.get().y,
                    radius: this.baseRadius,
                }
            ) ||
            wallManager.check(
                {
                    x: this.get().x,
                    y: this.get().y,
                    radius: this.baseRadius,
                }
            )
        ) {
            this.y = py;
            vy *= -1;
            this.ry *= -1;
        }

        this.vx = vx;
        this.vy = vy;

        this.rx = Math.abs(this.rx) <= this.tank.deceleration
            ? 0
            : this.rx - Math.sign(this.rx) * this.tank.deceleration;

        this.ry = Math.abs(this.ry) <= this.tank.deceleration
            ? 0
            : this.ry - Math.sign(this.ry) * this.tank.deceleration;
    }

    shot(mx, my) {
        const bullets = [];

        for (const gun of this.gun) {
            if (gun.shot <= 0  && this.active) {
                gun.shot = gun.reload;

                const bullet = this.bullet.find(item => item.id === gun.id);
                const angle = this.angle + gun.angle * Math.PI / 180;

                for (let i = 0; i < gun.count; i++) {
                    const x = this.x
                        + Math.cos(angle) * (this.tank.radius + gun.length - bullet.radius / 2)
                        - Math.sin(angle) * gun.y
                        + Math.cos(angle) * gun.x;

                    const y = this.y
                        + Math.sin(angle) * (this.tank.radius + gun.length - bullet.radius / 2)
                        + Math.cos(angle) * gun.y
                        + Math.sin(angle) * gun.x;

                    const aim = gun.aim / 2 * Math.PI / 180;
                    const spread = this.random.get(-aim, aim);

                    bullets.push(this.add(x, y, angle + spread, bullet));
                }

                this.rx = Math.max(-this.tank.maxSpeed, Math.min(this.tank.maxSpeed, this.rx - Math.cos(angle) * gun.recoil));
                this.ry = Math.max(-this.tank.maxSpeed, Math.min(this.tank.maxSpeed, this.ry - Math.sin(angle) * gun.recoil));
            }
        }

        return bullets;
    }

    add(x, y, angle, bullet) {
        return new Bullet(
            this.p,
            x,
            y,
            this.vx,
            this.vy,
            angle,
            this.color,
            this,
            this.name,
            {
                ...bullet,
            },
        );
    }

    hit(target) {
        if (target.class === 'tank') {
            if (this.invincible > 0) return false;
            this.invincible = 30;

            const dx = this.x - target.x;
            const dy = this.y - target.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                this.rx += (dx / distance) * target.recoil;
                this.ry += (dy / distance) * target.recoil;
            }
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
        }

        if (target.class === 'bullet') {
            this.rx = Math.max(-this.tank.maxSpeed, Math.min(this.tank.maxSpeed, this.rx + Math.cos(target.angle) * target.recoil));
            this.ry = Math.max(-this.tank.maxSpeed, Math.min(this.tank.maxSpeed, this.ry + Math.sin(target.angle) * target.recoil));
        }

        this.tank.health -= target.power;
        this.tank.healCount = this.tank.regeneration;

        return this.tank.health <= 0;
    }

    heal() {
        if (this.tank.health >= this.tank.armor) {
            this.tank.health = this.tank.armor;
            return;
        }

        if (this.tank.healCount > 0) {
            this.tank.healCount--;
            return;
        }

        this.tank.health = Math.min(
            this.tank.armor,
            this.tank.health + this.tank.heal
        );
    }

    getRequiredExp() {
        return 100 + this.level * 25;
    }

    kill(target) {
        if (target.class === 'object') {
            this.exp += target.totalExp + 50;
            this.totalExp += target.totalExp + 50;
        }

        if (target.class === 'tank') {
            this.exp += target.totalExp + 100;
            this.totalExp += target.totalExp + 100;
        }

        while (this.exp >= this.getRequiredExp()) {
            this.exp -= this.getRequiredExp();
            this.levelUp();
        }
    }

    death(target) {
        this.active = false;
    }

    levelUp(token = true) {
        this.level++;

        if (this.level <= 50) {
            this.tank.radius = this.baseRadius + this.level * 0.25;
            this.tank.zoom = this.baseZoom * Math.pow(this.baseRadius / this.tank.radius, 0.25);

            this.tank.recoil +=  0.01;
            this.tank.speed = Math.round((this.tank.speed - 0.01) * 100) / 100;
            this.tank.maxSpeed = Math.round((this.tank.maxSpeed + 0.01) * 100) / 100;
            this.tank.power = Math.round((this.tank.power + 0.5) * 100) / 100;
            this.tank.penetration = Math.round((this.tank.penetration + 0.5) * 100) / 100;
            this.tank.armor = Math.round((this.tank.armor + 2) * 100) / 100;
            this.tank.health = Math.min(this.tank.health + 2, this.tank.armor);
            this.tank.regeneration = Math.round((this.tank.regeneration - 2.4) * 100) / 100;
            this.tank.heal = Math.round((this.tank.heal + 0.002) * 1000) / 1000;

            if (token && this.level <= 40) {
                this.updateToken++;

                if (this.level % 10 === 0) {
                    this.upgradeToken++;
                }
            }
        }
    }

    upgrade(tank) {
        if (!this.upgradeToken) return false;
        this.upgradeToken--;
        this.tier++;

        return true;
    }

    update(status) {
        if (!this.updateToken) return false;

        const item = this.status.update(status.key);
        if (!item) return false;

        this.updateToken--;

        const [group, property] = status.key.split(".");

        this.applyStatus(item, group, property, 1);

        return true;
    }

    applyStatus(item, group, property, count) {
        if (group === "tank") {
            if (property === "count") {
                this.tank[property] = this.baseStats.tank[property] * (1 + item.rate * item.direction * item.count);
            } else {
                this.tank[property] = Math.round((this.tank[property] + item.rate * item.direction * count) * 100) / 100;
            }

            if (property === "armor") {
                this.tank.health = Math.min(this.tank.health + item.rate * item.direction * count, this.tank.armor);
                this.tank.regeneration = Math.max(0, this.tank.regeneration - 12 * count);
                this.tank.heal = Math.round((this.tank.heal + 0.01 * count) * 1000) / 1000;
            }

            if (property === "power") {
                this.tank.penetration = Math.round((this.tank.penetration + item.rate * item.direction * count) * 100) / 100;
            }

            if (property === "speed") {
                this.tank.maxSpeed = Math.round((this.tank.maxSpeed + item.rate * item.direction * count) * 100) / 100;
            }
        }

        if (group === "bullet") {
            for (let i = 0; i < this.bullet.length; i++) {
                this.bullet[i][property] = this.baseStats.bullet[i][property] * (1 + item.rate * item.direction * item.count);

                if (property === "power") {
                    this.bullet[i].penetration = this.baseStats.bullet[i].penetration * (1 + item.rate * item.direction * item.count);
                }

                if (property === "speed") {
                    const distance = this.baseStats.bullet[i].speed
                        * this.baseStats.bullet[i].range
                        + 20 * item.direction * item.count;

                    this.bullet[i].range = distance / this.bullet[i].speed;
                }
            }
        }
    }

    draw() {
        const p = this.p;

        p.push();

        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.scale(this.previewScale);

        p.rectMode(p.CORNER);

        p.stroke(Color.gun.border);
        p.strokeWeight(2);
        p.fill(Color.gun.fill);

        for (const gun of this.gun) {
            const bullet = this.bullet.find(item => item.id === gun.id);

            p.push();
            p.translate(gun.x, gun.y);
            p.rotate(gun.angle * Math.PI / 180);

            switch (gun.type) {
                case 'normal':
                    p.rect(
                        0,
                        -bullet.radius,
                        this.tank.radius + gun.length,
                        bullet.radius * 2
                    );
                    break;
                case 'wide':
                    p.beginShape();
                    p.vertex(0, -bullet.radius);
                    p.vertex(this.tank.radius, -bullet.radius);
                    p.vertex(this.tank.radius + gun.length, -bullet.radius - gun.length * Math.tan(gun.aim / 2 * Math.PI / 180));
                    p.vertex(this.tank.radius + gun.length, bullet.radius + gun.length * Math.tan(gun.aim / 2 * Math.PI / 180));
                    p.vertex(this.tank.radius, bullet.radius);
                    p.vertex(0, bullet.radius);
                    p.endShape(p.CLOSE);
                    break;
                case 'shotgun':
                    p.rect(
                        0,
                        -bullet.radius,
                        this.tank.radius + gun.length,
                        bullet.radius * 2
                    );

                    p.beginShape();
                    p.vertex(this.tank.radius + gun.length / 2, -bullet.radius);
                    p.vertex(this.tank.radius + gun.length, -bullet.radius - gun.length * Math.tan(gun.aim / 2 * Math.PI / 180));
                    p.vertex(this.tank.radius + gun.length, bullet.radius + gun.length * Math.tan(gun.aim / 2 * Math.PI / 180));
                    p.vertex(this.tank.radius + gun.length / 2, bullet.radius);
                    p.endShape(p.CLOSE);
                    break;
                case 'trap':
                    p.rect(
                        0,
                        -bullet.radius,
                        this.tank.radius + gun.length,
                        bullet.radius * 2
                    );
                    break;
            }
            p.pop();
        }

        p.stroke(this.color.border);
        p.strokeWeight(2);
        p.fill(this.color.fill);

        p.circle(
            0,
            0,
            this.tank.radius * 2,
        );

        p.pop();
    }

    drawLight() {
        const p = this.p;

        let distance = 0;
        let currentSpeed = this.bullet.speed;

        for (let count = 1; count <= this.bullet.range; count++) {
            distance += currentSpeed;

            if (count >= this.bullet.range) break;

            if (count > this.bullet.duration) {
                currentSpeed = Math.max(
                    0,
                    currentSpeed - this.bullet.deceleration
                );
            }

            if (currentSpeed === 0) break;
        }

        distance = distance + this.bullet.radius + this.gun.length;

        const vx = Math.cos(this.angle) * this.bullet.speed + this.vx;
        const vy = Math.sin(this.angle) * this.bullet.speed + this.vy;

        const angle = Math.atan2(vy, vx);

        const radius = this.bullet.radius;

        const halfAngle =
            (this.gun.aim / 2) *
            Math.PI / 180 +
            Math.asin(Math.min(1, radius / distance)
        );

        const steps = 30;

        p.push();
        p.translate(this.x, this.y);

        p.noStroke();
        p.fill([...Color.light.fill]);

        p.beginShape();

        p.vertex(
            -Math.sin(angle) * radius,
            Math.cos(angle) * radius
        );

        p.vertex(
            Math.sin(angle) * radius,
            -Math.cos(angle) * radius
        );

        for (let i = 0; i <= steps; i++) {
            const a = angle - halfAngle
                + (2 * halfAngle * i / steps);

            p.vertex(
                Math.cos(a) * distance,
                Math.sin(a) * distance
            );
        }

        p.endShape(p.CLOSE);
        p.pop();
    }

    drawHealth() {
        if (this.tank.health >= this.tank.armor) return;

        const p = this.p;

        const width = this.tank.armor / 3.75;
        const height = 4;

        const maxHealth = this.tank.armor;
        const healthRate = Math.max(
            0,
            Math.min(1, this.tank.health / maxHealth)
        );

        p.push();
        p.translate(this.x, this.y);

        p.noStroke();
        p.fill(Color.health.back);
        p.rect(-width / 2, this.tank.radius + 6, width, height);

        p.fill(Color.health.fill);
        p.rect(-width / 2, this.tank.radius + 6, width * healthRate, height);

        p.pop();
    }

    drawName() {
        const p = this.p;

        const name = this.name ?? "Unknown";

        p.push();
        p.translate(this.x, this.y);

        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(14);
        p.textStyle(p.BOLD);

        p.stroke(Color.name.stroke);
        p.strokeWeight(3);
        p.fill(Color.name.color);
        p.text(this.name, 0, -this.tank.radius - 12);

        p.pop();
    }

    get() {
        return {
            id: this.id,
            tank: this.constructor.name,
            class: 'tank',
            status: this.status,
            x: this.x,
            y: this.y,
            angle: this.angle,
            radius: this.tank.radius,
            zoom: this.tank.zoom,
            type: this.type,
            name: this.name,
            active: this.active,
            health: this.tank.health,
            healCount: this.tank.healCount,
            power: this.tank.power,
            armor: this.tank.armor,
            penetration : this.tank.penetration,
            recoil: this.tank.recoil,
            level: this.level,
            exp: this.exp,
            totalExp: this.totalExp,
            requiredExp: this.getRequiredExp(),
            upgradeToken: this.upgradeToken,
            updateToken: this.updateToken,
            tier: this.tier,
        }
    }
}