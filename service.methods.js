// This file contains the service methods that interact with the data

var data = require('./data_stub.js');

var entities = require('./service.entities.js');

// Methode exemple
exports.getList = function () {
    return data.list;
}

exports.getUsers = function() {
    return data.users;
}

exports.addUser = function(name, position=defaultLocation) {
    if (!data.users.include(name)) {
        // Register the user
        data.users.push(name);
        
        // Add the user in the list
        var newElt = {};
        newElt["name"] = name;
        newElt["position"] = position;

        data.list.push(newElt);
    }

}
