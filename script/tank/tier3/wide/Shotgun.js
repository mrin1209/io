import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Shotgun extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            {
                ...this.gun[0],
                id: 1,
                x: 0,
                y: 0,
                angle: 0,
                shot: 0,
                reload : 60, // 連射速度
                aim    : 30, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.5, // 発射反動
                type: 'shotgun',
            },
            {
                ...this.gun[0],
                id: 2,
                x: 0,
                y: 0,
                angle: 0,
                shot: 0,
                reload : 60, // 連射速度
                aim    : 25, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.5, // 発射反動
            },
            {
                ...this.gun[0],
                id: 3,
                x: 0,
                y: 0,
                angle: 0,
                shot: 0,
                reload : 60, // 連射速度
                aim    : 20, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.5, // 発射反動
            },
            {
                ...this.gun[0],
                id: 4,
                x: 0,
                y: 0,
                angle: 0,
                shot: 0,
                reload : 60, // 連射速度
                aim    : 15, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.5, // 発射反動
            },
        ]

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 3, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 135, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            },
            {
                ...this.bullet[0],
                id: 2,
                speed  : 2.7, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 150, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            },
            {
                ...this.bullet[0],
                id: 3,
                speed  : 2.5, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 165, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            },
            {
                ...this.bullet[0],
                id: 4,
                speed  : 2.3, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 180, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            }
        ]

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}