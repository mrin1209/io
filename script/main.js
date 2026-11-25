import Game from "./core/game.js";
import Input from "./core/input.js";
import Config from "./config/config.js";

new p5((p) => {
    let game;
    let input;

    p.setup = () => {
        p.frameRate(60);
        p.createCanvas(Config.canvas.width, Config.canvas.height);

        game = new Game(p);
        input = new Input(p, game);
    };

    p.draw = () => {
        game.run();

        if (p.mouseIsPressed) {
            input.mouseIsPressed(p.mouseX, p.mouseY);
        }

        if (p.keyIsPressed) {
            input.keyIsPressed(p.key);
        } else {
            input.keyIsReleased();
        }
    };

    p.mousePressed = () => {
        input.pressed(p.mouseX, p.mouseY);
    };

    p.mouseReleased = () => {
        input.released(p.mouseX, p.mouseY);
    }

    p.mouseWheel = (event) => {
        input.mouseWheel(event.delta);
    };

    p.keyPressed = () => {
        input.keyPressed(p.key);
    };

    p.keyReleased = () => {
        input.keyReleased(p.key);
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        game.resize();
    };
});