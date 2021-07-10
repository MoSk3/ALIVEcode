var EPSILON = 1e-10;
var GRAVITATIONAL_FORCE = 9.8;
function handleErrors(message) {
    throw new Error(message);
}
/**
 * @author Félix Jobin
 * @translator Mathis Laroche
 * @Role
 * This class contains all needed methods to calculate forces implicated in the car simulation.
 * Most of the methods work with <b>Vector2D</b> objects, which represent vectors with 2 components.
 *
 * @static
 * All methods in this class are static, and since it's an abstract class, it cannot be instantiated.
 *
 */
var PhysicEngine = {
    s: null,
    acceleration: function (sumForces, mass) {
        if (mass < EPSILON) {
            handleErrors("La masse entrée est égale ou presque égale à zéro");
            return;
        }
        return sumForces.clone().multiplyScalar(1 / mass);
    },
    speed: function (prevSpeed, acceleration) {
        var timeFactor = PhysicEngine.s.maxFPS / PhysicEngine.s.frameRate();
        var deltaSpeed = acceleration.multiplyScalar(timeFactor);
        return prevSpeed.clone().add(deltaSpeed);
    },
    rollingFrictionForce: function (rollFricCoef, mass, carSpeed) {
        var roleFricForceModulus = rollFricCoef * mass * GRAVITATIONAL_FORCE;
        var forceOrientation = carSpeed.clone().multiplyScalar(-1);
        return forceOrientation.clone().multiplyScalar(roleFricForceModulus);
    }
};
