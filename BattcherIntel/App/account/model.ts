import util = require('../util');

// Routes
var addExternalLoginUrl = "/api/Account/AddExternalLogin";
var changePasswordUrl = "/api/Account/changePassword";
var loginUrl = "/Token";
var logoutUrl = "/api/Account/Logout";
var registerUrl = "/api/Account/Register";
var registerExternalUrl = "/api/Account/RegisterExternal";
var removeLoginUrl = "/api/Account/RemoveLogin";
var setPasswordUrl = "/api/Account/setPassword";
export var siteUrl = siteUrl;
var userInfoUrl = "/api/Account/UserInfo";

// Route operations
function externalLoginsUrl(returnUrl, generateState) {
    return "/api/Account/ExternalLogins?returnUrl=" + (encodeURIComponent(returnUrl)) +
        "&generateState=" + (generateState ? "true" : "false");
}

function manageInfoUrl(returnUrl, generateState) {
    return "/api/Account/ManageInfo?returnUrl=" + (encodeURIComponent(returnUrl)) +
        "&generateState=" + (generateState ? "true" : "false");
}

// Other private operations
function getSecurityHeaders(): any {
    var accessToken = sessionStorage["accessToken"] || localStorage["accessToken"];

    if (accessToken) {
        return { "Authorization": "Bearer " + accessToken };
    }

    return {};
}

// Operations
export function toErrorsArray(data) {
    var errors = new Array(),
        items;

    if (!data || !data.message) {
        return null;
    }

    if (data.modelState) {
        for (var key in data.modelState) {
            items = data.modelState[key];

            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    errors.push(items[i]);
                }
            }
        }
    }

    if (errors.length === 0) {
        errors.push(data.message);
    }

    return errors;
}

export function archiveSessionStorageToLocalStorage() {
    var backup = {};

    for (var i = 0; i < sessionStorage.length; i++) {
        backup[sessionStorage.key(i)] = sessionStorage[sessionStorage.key(i)];
    }

    localStorage["sessionStorageBackup"] = JSON.stringify(backup);
    sessionStorage.clear();
};

export function restoreSessionStorageFromLocalStorage() {
    var backupText = localStorage["sessionStorageBackup"],
        backup;

    if (backupText) {
        backup = JSON.parse(backupText);

        for (var key in backup) {
            sessionStorage[key] = backup[key];
        }

        localStorage.removeItem("sessionStorageBackup");
    }
};

export function clearAccessToken() {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
}

export function setAccessToken(accessToken, persistent) {
    if (persistent) {
        localStorage["accessToken"] = accessToken;
    } else {
        sessionStorage["accessToken"] = accessToken;
    }
}

// Data access operations
export function addExternalLogin(data) {
    return $.ajax(addExternalLoginUrl, {
        type: "POST",
        data: data,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function changePassword(data) {
    return $.ajax(changePasswordUrl, {
        type: "POST",
        data: data,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function getExternalLogins(returnUrl, generateState) {
    return $.ajax(externalLoginsUrl(returnUrl, generateState), {
        cache: false,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function getManageInfo(returnUrl, generateState) {
    return $.ajax(manageInfoUrl(returnUrl, generateState), {
        cache: false,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function getUserInfo(accessToken) {
    var headers;

    if (typeof (accessToken) !== "undefined") {
        headers = {
            "Authorization": "Bearer " + accessToken
        };
    } else {
        headers = getSecurityHeaders();
    }

    return $.ajax(userInfoUrl, {
        cache: false,
        headers: headers
    }).then(result => result, util.failAsJson);
}

export function login(data) {
    return $.ajax(loginUrl, {
        type: "POST",
        data: data
    }).then(result => result, util.failAsJson);
}

export function logout() {
    return $.ajax(logoutUrl, {
        type: "POST",
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function register(data) {
    return $.ajax(registerUrl, {
        type: "POST",
        data: data
    }).then(result => result, util.failAsJson);
}

export function registerExternal(accessToken, data) {
    return $.ajax(registerExternalUrl, {
        type: "POST",
        data: data,
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(result => result, util.failAsJson);
}

export function removeLogin(data) {
    return $.ajax(removeLoginUrl, {
        type: "POST",
        data: data,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}

export function setPassword(data) {
    return $.ajax(setPasswordUrl, {
        type: "POST",
        data: data,
        headers: getSecurityHeaders()
    }).then(result => result, util.failAsJson);
}