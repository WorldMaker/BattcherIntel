import _ = require('underscore');
import ko = require('knockout');
import mission = require('../svc/mission');
import toastr = require('toastr');

class ArchiveVM {
    missions = ko.observableArray<mission.MissionVM>();

    activate() {
        return mission.getArchivedMissions().then(missions => {
            _.each(missions, m => {
                this.missions.push(new mission.MissionVM(m));
            })
        }).fail(e => toastr.error(e.message || "Unable to access mission archives right now."));
    }
}

export = ArchiveVM;