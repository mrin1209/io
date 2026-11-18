import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Mix extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [1, 0, 20, 20, 0.125],
            [2, 20, 15, 15, 0.25],
            [3, 40, 10, 10, 0.5],
        ].map(([id, shot,aim,  length, recoil ]) => ({
            ...this.gun[0],
            id: id,
            x: 0,
            y: 0,
            angle: 0,
            shot: shot,
            reload : 60, // 連射速度
            aim    : aim, // 拡散角度
            length : length,  // 砲身サイズ
            count  : 1, // 同時発射数
            recoil : recoil, // 発射反動
            type: 'normal'
        }));

        this.bullet = [
            [1, 7.5, 7.5, 7.5, 7.5, 0.125],
            [2, 10, 10, 10, 10, 0.25],
            [3, 12.5, 12.5, 12.5, 12.5, 0.5],
        ].map((
            [
                id,
                armor,
                power,
                penetration,
                radius,
                recoil
            ]
        ) => ({
            ...this.bullet[0],
            id: id,
            speed  : 3, // 弾丸速度
            armor  : armor, // 弾丸耐久力
            power  : power, // 攻撃力
            penetration : penetration, // 弾丸攻撃力
            duration: 30, // 初速持続時間
            deceleration: 0.01, // 減速率
            range  : 135, // 消滅時間
            radius   : radius, // 弾丸半径
            recoil : recoil, // 着弾反動
        }));

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}