import ko = require('knockout');
import moment = require('moment');
import security = require('../account/security');
import util = require('../util');

export class MissionVM {
    id: number;
    agent = ko.observable<string>();
    missionCode = ko.observable<string>();
    detailsPage = ko.computed(() => "#mission/" + this.missionCode());
    missionText = ko.observable<string>();
    unlocked = ko.observable<Moment>();
    completed = ko.observable<Moment>();
    isArchived = ko.observable<boolean>();
    reports = ko.observableArray<Report>();

    constructor(data?: Mission) {
        if (data) {
            this.id = data.id;
            this.update(data);
        }
    }

    update(data: Mission) {
        this.agent(data.agent.username);
        this.missionCode(data.missionCode);
        this.missionText(data.missionText);
        this.unlocked(moment.utc(data.unlocked).local());
        if (data.completed) {
            this.completed(moment.utc(data.completed).local());
        } else {
            this.completed(null);
        }
        this.isArchived(data.isArchived);
        this.reports(data.reports);
    }
}

export function getArchivedMissions() {
    return $.ajax('/api/mission/', {
        headers: security.getSecurityHeaders(),
    }).then<Mission[]>(result => result, util.failAsJson);
}

export function getMission(code: string) {
    return $.ajax('/api/mission/', {
        data: { code: code },
        headers: security.getSecurityHeaders(),
    }).then<Mission>(result => result, util.failAsJson);
}

export function search(query: string) {
    return $.ajax('/api/missionsearch/?query=' + query, {
        type: 'POST',
        headers: security.getSecurityHeaders(),
    }).then<Mission>(result => result, util.failAsJson);
}

export function dashboard() {
    return $.ajax('/api/dashboard/', {
        headers: security.getSecurityHeaders(),
    }).then<Dashboard>(result => result, util.failAsJson);
}