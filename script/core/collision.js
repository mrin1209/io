import Config from "../config/config.js";

export default class Collision {
    circleCircle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const radius = a.radius + b.radius;

        return dx * dx + dy * dy <= radius * radius;
    }

    circleRect(circle, rect) {
        const closestX = Math.max(
            rect.x,
            Math.min(circle.x, rect.x + rect.width)
        );

        const closestY = Math.max(
            rect.y,
            Math.min(circle.y, rect.y + rect.height)
        );

        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        return dx * dx + dy * dy <= circle.radius * circle.radius;
    }

    outside(object) {
        return (
            object.x - object.radius < 0 ||
            object.y - object.radius < 0 ||
            object.x + object.radius > Config.map.width ||
            object.y + object.radius > Config.map.height
        );
    }
}
