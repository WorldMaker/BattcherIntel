import _ = require('underscore');
import ko = require('knockout');
import security = require('../account/security');
import mission = require('../svc/mission');

class WelcomeVM {
    headLine = "Welcome to the Battcher Intelligence Agency";
    loggedIn = security.loggedIn;
    displayName = ko.computed(() => {
        if (security.loggedIn()) {
            return this.headLine + ', ' + (security.user().isInRole(/agent/i) ? 'Agent ' : '') + security.user().name();
        }
        return this.headLine;
    });
    available = ko.observable<number>();
    missions = ko.observableArray<mission.MissionVM>();

    activate() {
        if (security.user() && security.user().isInRole(/agent/i)) {
            return mission.dashboard().then(d => {
                this.available(d.available);
                this.missions(_.map(d.missions, m => new mission.MissionVM(m)));
            });
        }
    }
}

export = WelcomeVM;