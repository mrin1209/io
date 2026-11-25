const Config = {
    map: {
        width: 10000,
        height: 10000,
    },

    view: {
        width: 800,
        height: 600,
        chunk: 200,
        grid: 20,
    },

    area: {
        width: 800,
        height: 800,
    },

    spawn: {
        width: 2400,
        height: 2400,
    },

    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    max: {
        tank: 20,
        object: 200,
    },

    wall: {
        density: 0.2,
    },

    // seed: Math.floor(Math.random() * 900000) + 100000,
    seed: 367313,

    debug: false,
};

console.log(Config.seed);

if (Config.debug) {
    Config.map.width = 1000;
    Config.map.height = 1000;
    Config.max.tank = 0;
    Config.max.object = 0;
}

export default Config;