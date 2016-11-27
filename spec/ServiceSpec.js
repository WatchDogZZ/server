// Testing the Service
// All body returns are JSON
// Sot the body must be a stringified JSON Object test, otherwise it may fail

var request = require('request');

const SERVICE_PORT = process.env.PORT || 3000;
const SERVICE_URL = "http://localhost:" + SERVICE_PORT;

describe("Service", function () {
    it('should give the array of connected users', function (done) {

        request(SERVICE_URL+"/users", function (error, response, body) {

            expect(body).toEqual(
                JSON.stringify( { 'users': ['ben', 'benji'] } )
            );

            done();
        });
    });

    it('should say that ben is at init position', function (done) {

        request(SERVICE_URL+"/where/ben", function (error, response, body) {
           
            expect(body).toEqual(
                JSON.stringify( { 'position': [0.0, 0.0, 0.0] } )
            
            );

            done();

        });

    });


});