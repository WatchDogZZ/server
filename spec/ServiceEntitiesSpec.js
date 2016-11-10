const serviceEntities = require('../service.entities.js')

describe("Service entities : User", function () {

    var name = "ben";
    var position = [0.0, 0.0, 0.0];

    var benUser;

    it("should create a new user", function (done) {

        benUser = new serviceEntities.User(name, position);

        expect(benUser.getName()).toEqual(name);

        expect(benUser.getLocation()).toEqual(position);

        done();

    });

    it("should get the name", function (done) {

        expect(benUser.getName()).toEqual(name);

        done();

    });

    it("should get the location", function (done) {

        expect(benUser.getLocation()).toEqual(position);

        done();

    });

    var defaultName = "John Doe";
    var defaultLocation = [0.0, 0.0, 0.0];
    var anonymousUser;

    it("should create an anonymous user", function (done) {

        anonymousUser = new serviceEntities.User();

        done();

    });

    it("should have the default name", function (done) {

        expect(anonymousUser.getName()).toEqual(defaultName);

        done();

    });

    if ("should have the default location", function (done) {

        expect(anonymousUser.getLocation()).toEqual(defaultLocation);

        done();

    });

});