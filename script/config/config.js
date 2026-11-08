const Config = {
    map: {
        width: 5000,
        height: 5000,
    },

    view: {
        width: 750,
        height: 500,
        grid: 200,
    },

    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    max: {
        tank: 20,
        object: 255,
        status: 10,
    },

    wall: {
        density: 0.2,
    },

    debug: false,
};

export default Config;