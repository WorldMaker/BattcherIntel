import ko = require('knockout');
import mission = require('../svc/mission');
import report = require('../svc/report');
import toastr = require('toastr');
import util = require('../util');

class MissionDetailsVM extends mission.MissionVM {
    reportComments = ko.observable<string>();
    isFilingReport = ko.observable<boolean>();

    constructor() {
        super();
        util.subscribeProgress(this.isFilingReport);
    }

    activate(code) {
        return mission.getMission(code).then(m => {
            this.id = m.id;
            this.update(m);
        }).fail(e => {
                toastr.error(e.message || "Failed to load mission");
            });
    }

    fileReport() {
        this.isFilingReport(true);
        var r = {
            missionId: this.id,
            comments: this.reportComments(),
        }
        report.fileReport(r).then(result => {
            this.isFilingReport(false);
            this.reports.push(new report.ReportVM(result));
        }).fail(e => {
                this.isFilingReport(false);
                toastr.error(e.message || "Unable to file report");
            });
    }
}

export = MissionDetailsVM;