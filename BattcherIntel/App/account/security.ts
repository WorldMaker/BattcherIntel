/// <amd-dependency path="underscore-ko"/>
import dataModel = require('./model');
import ko = require('knockout');
import router = require('plugins/router');

export class UserVM {
    name = ko.observable<string>();
    roles = ko.observableArray<string>();

    constructor(name: string) {
        this.name(name);
    }

    isInRole(role: string): boolean {
        return this.roles.contains(role);
    }
}

export var user = ko.observable<UserVM>(null);

export var loggedIn = ko.computed(function () {
    return user() !== null;
});

export function login(userName, accessToken, persistent, returnHash?: string) {
    if (accessToken) {
        dataModel.setAccessToken(accessToken, persistent)
    }

    user(new UserVM(userName));
    if (returnHash) {
        router.navigate(returnHash);
    } else {
        router.navigate('');
    }
}

export function logoff() {
    return dataModel.logout().then(() => {
        user(null);
        dataModel.clearAccessToken();
        router.navigate('account/login');
    });
};