

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
 * Create a user according to data stored in a MongoDB document
 */
exports.loadUserFromMongoDocument = function (obj) {
    return new User(obj['name'], obj['location']);
}

/**
 * @returns the name of the entity
 */
User.prototype.getName = function () {
    return this.name;
}

/**
 * @returns the location of the entity
 */
User.prototype.getLocation = function () {
    return this.location;
}


/**
 * Change the location of a user
 * 
 * @param {any} locationArray An array containing the new location of the user
 */
User.prototype.setLocation = function (locationArray) {

    if (3 == locationArray.length) {
        this.location[0] = locationArray[0];
        this.location[1] = locationArray[1];
        this.location[2] = locationArray[2];
    }

}

/**
 * Change the location of the user
 * 
 * @param {any} longitude
 * @param {any} latitude
 * @param {any} elevation
 */
User.prototype.setLocation = function (longitude, latitude, elevation) {

    this.location[0] = longitude;
    this.location[1] = latitude;
    this.location[2] = elevation;
}

exports.User = User;