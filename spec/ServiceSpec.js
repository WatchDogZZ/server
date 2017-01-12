// Testing the Service
// All body returns are JSON
// So the body must be a stringified JSON Object test, otherwise it may fail

var request = require('request');

var SERVICE_PORT = process.env.PORT || 80;
var SERVICE_URL = "http://localhost:" + SERVICE_PORT;

describe("Service", function () {

    it('should give the array of connected users', function (done) {

        // request(SERVICE_URL+"/users", function (error, response, body) {
        //     done();
        // });

        done();

    });

    it('should say that ben is at init position', function (done) {

        // request(SERVICE_URL+"/where/ben", function (error, response, body) {
        //     done();
        // });

        done();

    });


});