import ko = require('knockout');

export class UserVM {
    name = ko.observable<string>();
    roles = ko.observableArray<string>();

    isInRole(role: string) {
        this.roles.contains(role);
    }
}

export var user = ko.observable<UserVM>(null);

export var loggedIn = ko.computed(function () {
    return user() !== null;
});