import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Sniper extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 0.9, // ズーム率
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
                reload : 90, // 連射速度
                aim    : 8, // 拡散角度
                length : 20,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil : 0.75, // 発射反動
                type: 'normal',
            },
        ]

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 6, // 弾丸速度
                armor  : 8, // 弾丸耐久力
                power  : 20, // 攻撃力
                penetration : 8, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 135, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 0.75, // 着弾反動
            }
        ]

        this.previewColor = Color.green;

        super.setup(param);
    }
}