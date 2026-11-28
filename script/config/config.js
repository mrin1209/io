const Config = {
    map: {
        width: 8000,
        height: 8000,
    },

    view: {
        width: 1000,
        height: 600,
        chunk: 200,
        grid: 20,
    },

    area: {
        width: 800,
        height: 800,
    },

    spawn: {
        width: 4000,
        height: 4000,
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
        margin: 2,
    },

    seed: Math.floor(Math.random() * 900000) + 100000,

    debug: false,
};

console.log(Config.seed);

if (Config.debug) {
    Config.map.width = 1000;
    Config.map.height = 1000;
    Config.max.tank = 0;
    Config.max.object = 0;
    Config.area.width = 0;
    Config.area.height = 0;
    Config.spawn.width = 0;
    Config.spawn.height = 0;
}

export default Config;