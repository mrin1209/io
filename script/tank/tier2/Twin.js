import Tank from "../tank.js";
import Color from "../../config/color.js";

export default class Twin extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [10, 0],
            [-10, 30],
        ].map(([y, shot]) => ({
            ...this.gun[0],
            id: 1,
            x: 0,
            y: y,
            angle: 0,
            shot: shot,
            reload : 60, // 連射速度
            aim    : 10, // 拡散角度
            length : 15,  // 砲身長さ
            radius : 7.5, // 砲身太さ
            count  : 1, // 同時発射数
            recoil : 0.25, // 発射反動
            type: 'normal',
        }));

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 2, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 120, // 初速持続時間
                deceleration: 0.025, // 減速率
                range  : 180, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 0.25, // 着弾反動
            }
        ]

        this.previewColor = Color.blue;

        super.setup(param);
    }
}