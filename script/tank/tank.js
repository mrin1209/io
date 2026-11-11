import Status from "../model/status.js";
import Color from "../config/color.js";
import Collision from "../core/collision.js";
import Bullet from "../bullet/bullet.js";

export default class Tank {
    constructor(param) {
        this.p = param.p;
        this.x = param.x;
        this.y = param.y;
        this.vx = 0;
        this.vy = 0;
        this.rx = 0;
        this.ry = 0;
        this.angle = 0;

        this.status = new Status();
        this.baseRadius = 15;
        this.baseLength = 15;

        this.tank = {
            speed  : 2,   // 移動速度
            armor  : 100, // 機体体力
            power  : 30,  // 機体攻撃力
            penetration : 30, // 弾丸攻撃力
            acceleration: 0.025, // 機体加速率
            deceleration: 0.025, // 機体減速率
            count  : 1, // 同時発射数
            zoom   : 1, // ズーム率
            radius : this.baseRadius,  // 機体半径
            regeneration: 0, // 再生速度
            recoil : 1, // 接触反動
        }

        this.gun = {
            reload : 60, // 連射速度
            aim    : 10, // 拡散角度
            length : this.baseLength,  // 砲身サイズ
            count  : 1, // 同時発射数
            recoil : 1, // 発射反動
        }

        this.bullet = {
            speed  : 3, // 弾丸速度
            armor  : 10, // 弾丸耐久力
            power  : 10, // 攻撃力
            penetration : 10, // 弾丸攻撃力
            duration: 60, // 初速持続時間
            deceleration: 0.25, // 減速率
            range  : 135, // 消滅時間
            radius   : 10, // 弾丸半径
            recoil : 1, // 着弾反動
        }

        this.id = crypto.randomUUID();
        this.level = 0;
        this.exp = 0;
        this.totalExp = 100;
        this.upgradeToken = 0;
        this.updateToken = 0;
        this.tier = 1;

        this.previewColor = Color.blue;
        this.previewScale = 1;

        this.active = true;
        this.invincible = 0;

        this.collision = new Collision();
    }

    setup(param) {
        this.baseZoom = this.tank.zoom;

        this.baseStats = {
            tank: {
                armor: this.tank.armor,
                power: this.tank.power,
                speed: this.tank.speed,
            },
            gun: {
                reload: this.gun.reload,
            },
            bullet: {
                speed: this.bullet.speed,
                armor: this.bullet.armor,
                power: this.bullet.power,
            },
        };

        if (param.status) {
            this.status = param.status;
        }

        for (const item of this.status.items) {
            const [group, property] = item.key.split(".");

            this[group][property] =
                this.baseStats[group][property] *
                (1 + item.rate * item.direction * item.count);
        }

        this.name = param.name ?? this.name;
        this.type = param.type ?? this.type;
        this.upgradeToken = param.upgradeToken ?? this.upgradeToken;
        this.updateToken = param.updateToken ?? this.updateToken;
        this.tank.health = param.health ?? this.tank.armor;
        this.tank.regeneration = param.regeneration ?? this.tank.regeneration;
        this.exp = param.exp ?? this.exp;
        this.totalExp = param.totalExp ?? this.totalExp;
        this.tier = param.tier ?? this.tier,

        this.count = this.gun.reload;
        this.color = this.color ?? (this.type === 'player' ? Color.blue : Color.red);

        for (let i = 0; i < (param.level ?? 1); i++) {
            this.levelUp(false);
        }
    }

    run() {
        if (this.count < this.gun.reload) {
            this.count++;
        }

        if (this.invincible > 0) {
            this.invincible--;
        }

        this.heel();
    }

    draw() {
        const p = this.p;

        p.push();

        p.translate(this.x, this.y);
        p.scale(this.previewScale);

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

    shot() {
        if (this.count >= this.gun.reload && this.active) {
            this.count = 0;

            this.rx -= Math.cos(this.angle) * this.gun.recoil;
            this.ry -= Math.sin(this.angle) * this.gun.recoil;

            return true;
        }

        return false;
    }

    add(x, y, angle) {
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
                ...this.bullet,
            },
        );
    }

    hit(target) {
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
            this.rx += Math.cos(target.angle) * target.recoil;
            this.ry += Math.sin(target.angle) * target.recoil;
        }

        this.tank.health -= target.power;
        this.tank.regeneration = 600;

        return this.tank.health <= 0;
    }

    heel() {
        if (this.tank.health >= this.tank.armor) {
            this.tank.health = this.tank.armor;
            return;
        }

        if (this.tank.regeneration > 0) {
            this.tank.regeneration--;
            return;
        }

        this.tank.health = Math.min(
            this.tank.armor,
            this.tank.health + 0.1
        );
    }

    getRequiredExp() {
        return 100 + this.level * 25;
    }

    kill(target) {
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

    levelUp(token = true) {
        this.level++;

        if (this.level <= 50) {
            this.tank.radius = this.baseRadius + ((this.level - 1) * 0.25);
            this.tank.zoom = this.baseZoom * Math.pow(this.baseRadius / this.tank.radius, 0.25);
            this.gun.length = this.baseLength + this.tank.radius;

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
        this.updateToken--;

        const item = this.status.update(status.key);
        if (!item) return false;

        const [group, property] = status.key.split(".");

        this[group][property] =
            this.baseStats[group][property] *
            (1 + item.rate * item.direction * item.count);

        if (group === "gun" && property === "reload") {
            this.gun.reload = Math.max(1, this.gun.reload);
        }

        if (group === "tank" && property === "armor") {
            const increase =
                this.baseStats.tank.armor *
                item.rate *
                item.direction;

            this.tank.health = Math.min(
                this.tank.armor,
                this.tank.health + increase
            );
        }

        return true;
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

        const width = this.tank.radius * 2;
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
            radius: this.tank.radius,
            zoom: this.tank.zoom,
            type: this.type,
            name: this.name,
            active: this.active,
            health: this.tank.health,
            regeneration: this.tank.regeneration,
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