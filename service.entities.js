// Service entities

exports.defaultName = "John Doe";
exports.defaultLocation = [0.0, 0.0, 0.0];

/**
 * 
 * Create a new user
 * @param {string} [name="John Doe"] The name
 * @param {array} [location=exports.defaultLocation] The longitude, latitude and elevation
 */
function User(name = exports.defaultName, location = exports.defaultLocation) {
    this.name = name;
    this.location = location;
}

/**
 * Create a user according to data stored in a MongoDB document
 * @param {MongoDB.Document} obj The MongoDB document containing the information of the User
 * @return {User} A new instance of a user with the information of obj
 */
exports.loadUserFromMongoDocument = function (obj) {
    // A new user with default values
    var user = new User();

    if (null != obj) {

        // Copying each attribute contained in the document
        for (var att in obj) {

            // Copy all attributes BUT _id
            if (obj.hasOwnProperty(att) && '_id' != att) {
                user[att] = obj[att];
            }
        }
    }

    return user;
}

/**
 * Get the name of the User
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