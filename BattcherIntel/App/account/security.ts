/// <amd-dependency path="underscore-ko"/>
import dataModel = require('./model');
import ko = require('knockout');
import router = require('plugins/router');
import system = require('durandal/system');

export var getSecurityHeaders = dataModel.getSecurityHeaders;

export class UserVM {
    name = ko.observable<string>();
    roles = ko.observableArray<string>();

    constructor(name: string) {
        this.name(name);
    }

    isInRole(role: RegExp): boolean {
        return this.roles.some(r => role.test(r));
    }
}

export var user = ko.observable<UserVM>(null);

export var loggedIn = ko.computed(function () {
    return user() !== null;
});

export function login(userName, accessToken, persistent, returnHash?: string, roles?: string[]) {
    if (accessToken) {
        dataModel.setAccessToken(accessToken, persistent)
    }

    user(new UserVM(userName));

    if (roles) {
        user().roles(roles);
    }

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


// Get url fragments
function getFragment() {
    if (window.location.hash.indexOf("#") === 0) {
        return parseQueryString(window.location.hash.substr(1));
    } else {
        return {};
    }
};

// Set query string parameters to an object
function parseQueryString(queryString) {
    var data = {},
        pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

    if (queryString === null) {
        return data;
    }

    pairs = queryString.split("&");

    for (var i = 0; i < pairs.length; i++) {
        pair = pairs[i];
        separatorIndex = pair.indexOf("=");

        if (separatorIndex === -1) {
            escapedKey = pair;
            escapedValue = null;
        } else {
            escapedKey = pair.substr(0, separatorIndex);
            escapedValue = pair.substr(separatorIndex + 1);
        }

        key = decodeURIComponent(escapedKey);
        value = decodeURIComponent(escapedValue);

        data[key] = value;
    }

    return data;
};

// Verify the returned state match with the stored one
function verifyStateMatch(fragment) {
    var state;

    if (typeof (fragment.access_token) !== "undefined") {
        state = sessionStorage["state"];
        sessionStorage.removeItem("state");

        if (state === null || fragment.state !== state) {
            fragment.error = "invalid_state";
        }
    }
};

// Cleanup location fragment
function cleanUpLocation() {
    window.location.hash = "";

    if (history && typeof (history.pushState) !== "undefined") {
        history.pushState("", document.title, location.pathname);
    }
};

/**
 * Always call this method when initializating the application for getting authenticated user info (from storage)
 * or redirect when returning from a provider or associating another login
 */
export function initializeAuth() {
    return system.defer(function (dfd) {
        var fragment: any = getFragment(),
            externalAccessToken, externalError, loginUrl;

        dataModel.restoreSessionStorageFromLocalStorage();
        verifyStateMatch(fragment);

        if (sessionStorage["associatingExternalLogin"]) {
            sessionStorage.removeItem("associatingExternalLogin");

            if (typeof (fragment.error) !== "undefined") {
                externalAccessToken = null;
                externalError = fragment.error;
                cleanUpLocation();
            } else if (typeof (fragment.access_token) !== "undefined") {
                externalAccessToken = fragment.access_token;
                externalError = null;
                cleanUpLocation();
            } else {
                externalAccessToken = null;
                externalError = null;
                cleanUpLocation();
            }

            dataModel.getUserInfo()
                .done(function (data) {
                    if (data.userName) {
                        login(data.userName, null, false, null, data.roles);
                        sessionStorage["redirectTo"] = "account/manage?externalAccessToken=" + externalAccessToken + "&externalError=" + externalError;
                    }
                    dfd.resolve(true);
                })
                .fail(function () {
                    dfd.resolve(true);
                });
        } else if (typeof (fragment.error) !== "undefined") {
            cleanUpLocation();
            sessionStorage["redirectTo"] = ''; // TODO: "account/externalloginfailure";
            dfd.resolve(true);
        } else if (typeof (fragment.access_token) !== "undefined") {
            cleanUpLocation();
            dataModel.getUserInfo(fragment.access_token)
                .done(function (data) {
                    if (typeof (data.userName) !== "undefined" && typeof (data.hasRegistered) !== "undefined"
                        && typeof (data.loginProvider) !== "undefined") {
                        if (data.hasRegistered) {
                            // Change persistent to true for storing the authentication token in local storage when
                            // login with external services
                            login(data.userName, fragment.access_token, false, null, data.roles);
                            dfd.resolve(true);
                        }
                        else if (typeof (sessionStorage["loginUrl"]) !== "undefined") {
                            loginUrl = sessionStorage["loginUrl"];
                            sessionStorage.removeItem("loginUrl");
                            sessionStorage["redirectTo"] = "account/registerExternal?userName=" + data.userName +
                                "&loginProvider=" + data.loginProvider +
                                "&access_token=" + fragment.access_token +
                                "&loginUrl=" + encodeURIComponent(loginUrl) +
                                "&state=" + fragment.state;
                            dfd.resolve(true);
                        }
                        else {
                            dfd.resolve(true);
                        }
                    } else {
                        dfd.resolve(true);
                    }
                })
                .fail(function () {
                    dfd.resolve(true);
                });
        } else {
            dataModel.getUserInfo()
                .done(function (data) {
                    if (data.userName) {
                        login(data.userName, null, false, null, data.roles);
                    }
                    dfd.resolve(true);
                })
                .fail(function () {
                    dfd.resolve(true);
                });
        }
    }).promise();
}