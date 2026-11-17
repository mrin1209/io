import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Trap extends Tank {
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
                aim    : 20, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0, // 発射反動
                type: 'trap'
            },
        ]

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 2, // 弾丸速度
                armor  : 100, // 弾丸耐久力
                power  : 30, // 攻撃力
                penetration : 100, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.25, // 減速率
                range  : 600, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            }
        ]

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}