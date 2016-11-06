// This file contains the service methods that interact with the data

var data = require('./data_stub.js');

// Methode exemple
exports.getList = function () {
    return data.list;
}

exports.getUsers = function() {
    return data.users;
}

exports.addUser = function(name, position=[0.0, 0.0]) {
    if(!data.users.include(name)) {
        data.users.push(name);
        
        var newElt = {};
        newElt["name"] = name;
        newElt["position"] = position;

        data.list.push(newElt);
    }

}

/// Default location for a user
exports.defaultLocation = [0.0, 0.0];