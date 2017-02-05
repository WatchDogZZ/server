// Testing the Service
// All body returns are JSON
// So the body must be a stringified JSON Object test, otherwise it may fail

var request = require('request');

var SERVICE_PORT = process.env.PORT || 80;
var SERVICE_URL = "http://localhost:" + SERVICE_PORT;

describe("Service", function () {

    var userName = 'benji';
    var userLoc = [0.0, 0.0, 0.0];

    it('should connect me', function (done) {

        request.post(SERVICE_URL + '/login', {
            json: true,
            body: {
                'name': userName,
                'location': userLoc
            }
        }, function (error, response, body) {

            expect(error).toBeNull();

            done();
        });

    });

    it('should contains my name in connected list', function (done) {

        request.get(SERVICE_URL + '/who', function (error, response, body) {

            expect(error).toBeNull();
            expect(response).not.toBeNull();
            expect(body).not.toBeNull();

            var bodyParsed = JSON.parse(body);

            expect(bodyParsed.list).toContain(userName);

            done();

        });

        done();

    });
    

    it('should give my initial position', function (done) {

        request.get(SERVICE_URL + '/where', function (error, response, body) {

            expect(error).toBeNull();
            expect(response).not.toBeNull();
            expect(body).not.toBeNull();

            var bodyParsed = JSON.parse(body);

            // To list should be not null and contain elements
            expect(bodyParsed.list).not.toBeNull();
            expect(bodyParsed.list.length).toBeGreaterThan(0);

            var me = bodyParsed.list.filter((value, index, array) => {
                return value.name == userName;
            })[0];

            expect(me).not.toBeNull();
            expect(me).not.toBeUndefined();

            expect(me.location).toEqual(userLoc);

            done();

        });

    });

    var newLoc1 = [10.0, 20.0, 30.0];

    it('should update my location', function (done) {
        
        request.post(SERVICE_URL + '/where', {
            json: true,
            body: {
                'name': userName,
                'location': newLoc1
            }
        }, function (error, response, body) {

            expect(error).toBeNull();
            expect(response).not.toBeNull();
            expect(body).not.toBeNull();

            done();
            
        });

    });


    it('should give my new position', function (done) {

        request.get(SERVICE_URL + '/where', function (error, response, body) {

            expect(error).toBeNull();
            expect(response).not.toBeNull();
            expect(body).not.toBeNull();

            var bodyParsed = JSON.parse(body);

            expect(bodyParsed.list).not.toBeNull();
            expect(bodyParsed.list.length).toBeGreaterThan(0);

            var me = bodyParsed.list.filter((value, index, array) => {
                return value.name == userName;
            })[0];

            expect(me).not.toBeNull();
            expect(me).not.toBeUndefined();

            expect(me.location).toEqual(newLoc1);

            done();

        });

    });

    it('should logout me', function (done) {

        request.post(SERVICE_URL + '/logout', {
            json: true,
            body: {
                'name': userName
            }
        },
            function (error, response, body) {

                expect(error).toBeNull();

                done();

            });

    });


});