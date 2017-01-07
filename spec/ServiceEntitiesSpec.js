// Testing the entities of the service

const serviceEntities = require('../service.entities.js');

describe("Service entities : User", function () {

    var nameBen = "ben";
    var positionBen = [0.0, 0.0, 0.0];

    var benUser = new serviceEntities.User(nameBen, positionBen);

    it("should be allocated", function (done) {
        
        expect(benUser).not.toBeNull();

        done();

    });

    it("should get the name", function (done) {

        expect(benUser.getName()).toEqual(nameBen);

        done();

    });

    it("should get the location", function (done) {

        expect(benUser.getLocation()).toEqual(positionBen);

        done();

    });

    var defaultName = "John Doe";
    var defaultLocation = [0.0, 0.0, 0.0];

    var anonymousUser = new serviceEntities.User();

    it("should be default allocated", function (done) {

        expect(anonymousUser).not.toBeNull();

        done();

    });

    it("should have the default name", function (done) {

        expect(anonymousUser.getName()).toEqual(defaultName);

        done();

    });

    it("should have the default location", function (done) {

        expect(anonymousUser.getLocation()).toEqual(defaultLocation);

        done();

    });

});