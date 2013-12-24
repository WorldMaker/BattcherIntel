import _ = require('underscore');
import ko = require('knockout');
import security = require('../account/security');
import mission = require('../svc/mission');
import report = require('../svc/report');

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
    isBirthday = ko.observable<boolean>();
    missions = ko.observableArray<mission.MissionVM>();
    reports = ko.observableArray<report.DashboardReportVM>();

    activate() {
        if (security.user() && security.user().isInRole(/agent/i)) {
            return mission.dashboard().then(d => {
                this.available(d.available);
                this.isBirthday(d.isBirthday);
                this.missions(_.map(d.missions, m => new mission.MissionVM(m)));
                this.reports(_.map(d.reports, r => new report.DashboardReportVM(r)));
            });
        }
    }
}

export = WelcomeVM;