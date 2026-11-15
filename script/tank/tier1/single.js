import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Single extends Tank {
    constructor(param) {
        super(param);

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

        this.gun = [
            {
                ...this.gun[0],
                id     : 1, // 識別番号
                reload : 60, // 連射速度
                shot   : 0, // 発射間隔
                aim    : 10, // 拡散角度
                length : 15,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 1, // 発射反動
            },
        ]

        this.bullet = [
            {
                ...this.bullet[0],
                id     : 1, // 識別番号
                speed  : 3, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 60, // 初速持続時間
                deceleration: 0.25, // 減速率
                range  : 135, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            },
        ]

        super.setup(param);
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
        p.rect(
            0,
            -this.bullet.radius,
            this.tank.radius + this.gun.length,
            this.bullet.radius * 2
        );

        p.pop();

        super.draw();
    }

    shot(mx, my) {
        const bullets = [];

        for (const gun of this.gun) {
            if (gun.id !== bullet.id) continue;
            if (!super.shot(gun)) continue;

            const aim = gun.aim / 2 * Math.PI / 180;
            const spread = this.p.random(-aim, aim);
            const angle = this.angle + spread;

            const distance =
                this.tank.radius + gun.length - bullet.radius / 2;

            const x = this.x + Math.cos(this.angle) * distance;
            const y = this.y + Math.sin(this.angle) * distance;

            bullets.push(this.add(x, y, angle, bullet));
        }

        return bullets;
    }
}