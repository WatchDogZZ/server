

exports.defaultLocation = [0.0, 0.0, 0.0];

/**
 * 
 * Create a new user
 * @param {string} [name="John Doe"] The name
 * @param {array} [location=exports.defaultLocation] The longitude, latitude and elevation
 */
function User(name, location) {
    this.name = name || "John Doe";
    this.location = location || [0.0, 0.0, 0.0];
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
 * Set the name of the user
 *
 * @param {string} name The new name
 */
User.prototype.setName = function (name) {
    this.name = name;
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
 * @param {Array} locationArray An array containing the new location of the user
 */
User.prototype.setLocation = function (locationArray) {

    if (3 == locationArray.length) {
        this.location[0] = locationArray[0];
        this.location[1] = locationArray[1];
        this.location[2] = locationArray[2];
    }

}

exports.User = User;