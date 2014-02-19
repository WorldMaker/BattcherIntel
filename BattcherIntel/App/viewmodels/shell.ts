/// <amd-dependency path="bootstrap"/>
export import router = require('plugins/router');
import app = require('durandal/app');
export import security = require('../account/security');
import util = require('../util');
import mission = require('../svc/mission');
import ko = require('knockout');
import toastr = require('toastr');

// Mix-in for authorization requirement
interface AuthorizedDurandalRouteConfiguration extends DurandalRouteConfiguration {
    authorize?: RegExp;
}

export var loggedIn = security.loggedIn;

export var user = security.user;

export var searchQuery = ko.observable<string>();

export var unlockable = ko.observable<number>();

export function updateUnlockBadge() {
        return mission.unlockBadge().then(count => unlockable(count))
                .fail(e => toastr.error(e.message, "Unlockable Mission Counting Error"));
}

export function search() {
        mission.search(searchQuery()).then(m => router.navigate(new mission.MissionVM(m).detailsPage()))
                .fail(e => {
                        if (e.message) {
                                toastr.error(e.message);
                        } else {
                                toastr.warning('Nothing was found.');
                        }
                })
                .then(() => updateUnlockBadge());
}

export function logout() {
    return security.logoff().then(() => updateUnlockBadge());
}

export function activate() {
        util.subscribeProgress(router.isNavigating);

        user.subscribe(() => updateUnlockBadge());

    // If the route has the authorize flag and the user is not logged in => navigate to login view                                
    router.guardRoute = function (instance, instruction: DurandalRouteInstruction) {
        if (sessionStorage["redirectTo"]) {
            var redirectTo = sessionStorage["redirectTo"];
            sessionStorage.removeItem("redirectTo");
            return redirectTo;
        }

        var config = <AuthorizedDurandalRouteConfiguration>instruction.config;
        if (config.authorize) {
            if (security.loggedIn()) {
                if (security.user().isInRole(config.authorize)) {
                    return true;
                } else {
                    return "/account/login?returnUrl=" + encodeURIComponent(instruction.fragment);
                }
            } else {
                return "/account/login?returnUrl=" + encodeURIComponent(instruction.fragment);
            }
        } else {
            return true;
        }
    };

    router.map([
        { route: '', title: 'Welcome', moduleId: 'viewmodels/welcome', nav: true },
        { route: 'archive', moduleId: 'viewmodels/archive', nav: true, authorize: /agent/i },
        { route: 'stats', moduleId: 'viewmodels/stats', nav: true, authorize: /agent/i },
        { route: 'mission/:code', moduleId: 'viewmodels/mission', nav: false, authorize: /agent/i },

        // Accounts
        { route: 'account/login', title: 'Login', moduleId: 'viewmodels/account/login', nav: false },
        { route: 'account/manage', title: 'Manage', moduleId: 'viewmodels/account/manage', nav: false },
        { route: 'account/register', title: 'Register', moduleId: 'viewmodels/account/register', nav: false },
        { route: 'account/registerExternal', title: 'Register', moduleId: 'viewmodels/account/registerExternal', nav: false },
    ]).buildNavigationModel();

        var update: JQueryPromise<any>;
        if (security.loggedIn()) {
                update = updateUnlockBadge();
        }
        else {
                update = $.Deferred().resolve();
        }


    return update.then(router.activate);
}