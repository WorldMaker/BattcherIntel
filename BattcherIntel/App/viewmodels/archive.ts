import _ = require('underscore');
import ko = require('knockout');
import mission = require('../svc/mission');

class ArchiveVM {
    missions = ko.observableArray<mission.MissionVM>();

    activate() {
        return mission.getArchivedMissions().then(missions => {
            this.missions.removeAll();
            _.each(missions, m => {
                this.missions.push(new mission.MissionVM(m));
            })
        });
    }
}

export = ArchiveVM;