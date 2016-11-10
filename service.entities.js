

exports.defaultLocation = [0.0, 0.0, 0.0];

/**
 * 
 * Create a new user
 * @param {string} [name="John Doe"] The name
 * @param {array} [location=exports.defaultLocation] The longitude, latitude and elevation
 */
function User(name = "John Doe", location = exports.defaultLocation) {
    this.name = name;

    this.location = location;
}

/**
 * @returns the name of the entity
 */
User.prototype.getName = function() {
    return this.name;
}

/**
 * @returns the location of the entity
 */
User.prototype.getLocation = function () {
    return this.location;
}

exports.User = User;