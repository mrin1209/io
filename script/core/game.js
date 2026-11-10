import Camera from "./camera.js";
import Field from "./field.js";
import LogManager from "../manager/logManager.js";
import BulletManager from "../manager/bulletManager.js";
import TankManager from "../manager/tankManager.js";
import ObjectManager from "../manager/objectManager.js";
import WallManager from "../manager/wallManager.js";
import UpgradeManager from "../manager/upgradeManager.js";
import UpdateManager from "../manager/updateManager.js";
import ScoreManager from "../manager/scoreManager.js";
import MapManager from "../manager/mapManager.js";
import LevelManager from "../manager/levelManager.js"
import Config from "../config/config.js";

export default class Game {
    constructor(p) {
        this.p = p;

        this.camera = new Camera(this.p);
        this.field = new Field(this.p);

        this.wallManager = new WallManager(this.p);

        this.logManager = new LogManager(this.p);

        this.upgradeManager = new UpgradeManager(this.p);
        this.updateManager = new UpdateManager(this.p);

        this.bulletManager = new BulletManager(
            this.p,
            this.wallManager,
        );

        this.objectManager = new ObjectManager(
            this.p,
            this.wallManager,
            this.bulletManager,
            this.logManager,
        );

        this.tankManager = new TankManager(
            this.p,
            this.bulletManager,
            this.objectManager,
            this.wallManager,
            this.logManager,
        );

        this.scoreManager = new ScoreManager(
            this.p,
            this.tankManager
        );

        this.mapManager = new MapManager(
            this.p,
            this.wallManager,
            this.tankManager
        );

        if (Config.debug) {
            this.tankManager.add('debug');
        } else {
            // for (let i = 0; i < 100000; i++) {
            //     this.loop();
            // }
        }

        this.levelManager = new LevelManager(this.p);

        this.setup();
    }

    setup() {
        const input = document.createElement("input");

        input.type = "text";
        input.value = "player";
        input.placeholder = "名前を入力してください";
        input.maxLength = 10;

        input.style.position = "fixed";
        input.style.left = "50%";
        input.style.top = "70%";
        input.style.transform = "translate(-50%, -50%)";
        input.style.width = "200px";
        input.style.padding = "12px";
        input.style.fontSize = "18px";
        input.style.textAlign = "center";
        input.style.zIndex = "1000";
        input.style.display = "none";

        document.body.appendChild(input);

        addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const name = input.value.trim();

            if (this.tankManager.player) return;

            const success = this.tankManager.add(name);

            if (success) {
                input.value = "";
                input.style.display = "none";
            }

            this.upgradeManager.create(this.tankManager.player.get());
        });

        this.nameInput = input;
    }

    updateNameInput() {
        if (this.tankManager.player) {
            this.nameInput.style.display = "none";
        } else {
            this.nameInput.style.display = "block";
        }
    }

    run() {
        const p = this.p;

        this.loop();

        this.updateNameInput();

        p.push();

        this.setCamera();
        this.field.run();

        this.wallManager.draw();
        this.objectManager.draw();
        this.tankManager.draw();
        this.bulletManager.draw();

        this.updateManager.draw(this.tankManager.player);
        this.upgradeManager.draw(this.tankManager.player);

        this.mapManager.draw();
        this.scoreManager.draw();
        this.logManager.draw();
        this.levelManager.draw(this.tankManager.player);


        p.pop();
    }

    loop() {
        this.objectManager.run();
        this.tankManager.run();
        this.bulletManager.run();
    }

    move(dx, dy) {
        if (!this.tankManager.player) return;

        this.tankManager.player.move(dx, dy, this.wallManager);
    }

    shot(mx, my) {
        if (!this.tankManager.player) return;
        
        const bullet = this.tankManager.player.shot(mx, my);

        if (bullet) {
            this.bulletManager.add(bullet);
        }

    }

    setCamera() {
        if (this.tankManager.player) {
            this.camera.run(this.tankManager.player.get());
            return;
        }

        if (this.tankManager.watch) {
            this.camera.run(this.tankManager.watch.get());
            return;
        }

        this.camera.run({
            x: Config.map.width / 2,
            y: Config.map.height / 2,
        });
    }

    upgrade(x, y) {
        const tank = this.tankManager.player;

        if (!tank) return;

        const TankClass = this.upgradeManager.pressed(x, y);
        if (TankClass) {
            tank.upgrade(TankClass);
        }

        this.tankManager.change(tank);
        this.tankManager.set(tank);

        this.logManager.awakening(tank.get());
    }

    update(x, y) {
        const tank = this.tankManager.player;

        if (!tank) return;

        const item = this.updateManager.pressed(x, y);
        if (item) {
            tank.update(item);
        }
    }

    zoom(delta) {
        if (!Config.debug) return;
        if (!this.tankManager.player) return;

        const zoomSpeed = 0.02;

        if (delta < 0) {
            this.tankManager.player.tank.tank.zoom += zoomSpeed;
            this.tankManager.player.tank.baseZoom += zoomSpeed;
        } else {
            this.tankManager.player.tank.tank.zoom -= zoomSpeed;
            this.tankManager.player.tank.baseZoom -= zoomSpeed;
        }
    }
}