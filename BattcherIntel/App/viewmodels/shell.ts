export import router = require('plugins/router');
import app = require('durandal/app');
export import security = require('../account/security');

// Mix-in for authorization requirement
interface AuthorizedDurandalRouteConfiguration extends DurandalRouteConfiguration {
    authorize?: string;
}

export var loggedIn = security.loggedIn;

export function search() {
    //It's really easy to show a message box.
    //You can add custom options too. Also, it returns a promise for the user's response.
    app.showMessage('Search not yet implemented...');
}

export function activate() {
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
        { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true, authorize: 'agent' },

        // Accounts
        { route: 'account/login', title: 'Login', moduleId: 'viewmodels/account/login', nav: false },
        { route: 'account/manage', title: 'Manage', moduleId: 'viewmodels/account/manage', nav: false },
        { route: 'account/register', title: 'Register', moduleId: 'viewmodels/account/register', nav: false },
        { route: 'account/registerExternal', title: 'Register', moduleId: 'viewmodels/account/registerExternal', nav: false },
    ]).buildNavigationModel();

    return router.activate();
}