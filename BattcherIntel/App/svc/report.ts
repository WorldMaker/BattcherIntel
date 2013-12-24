import ko = require('knockout');
import moment = require('moment');
import security = require('../account/security');
import util = require('../util');

export class ReportVM {
    id: number;
    type = ko.observable<number>();
    created = ko.observable<Moment>();
    comments = ko.observable<string>();
    agent = ko.observable<Agent>();

    constructor(data: Report) {
        this.id = data.id;
        this.update(data);
    }

    update(data: Report) {
        this.type(data.type);
        this.created(moment.utc(data.created).local());
        this.comments(data.comments);
        this.agent(data.agent);
    }
} 

export class DashboardReportVM extends ReportVM {
    missionCode = ko.observable<string>();
    detailsPage = ko.computed(() => "#mission/" + this.missionCode());

    constructor(data: DashboardRecentReport) {
        super(data.report);
        this.missionCode(data.missionCode);
    }
}

export function fileReport(report) {
    return $.ajax('/api/report/', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(report),
        headers: security.getSecurityHeaders(),
    }).then<Report>(result => result, util.failAsJson);
}