import ko = require('knockout');
import security = require('../account/security');

class WelcomeVM {
    headLine = "Welcome to the Battcher Intelligence Agency";
    loggedIn = security.loggedIn;
    displayName = ko.computed(() => {
        if (security.loggedIn()) {
            return this.headLine + ', ' + (security.user().isInRole('agent') ? 'Agent ' : '') + security.user().name();
        }
        return this.headLine;
    });
}

export = WelcomeVM;