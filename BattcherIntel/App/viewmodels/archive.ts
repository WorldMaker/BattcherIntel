import breeze = require('breeze');
import ko = require('knockout');
import missionsvc = require('../svc/mission');

class ArchiveVM {
    missions = ko.observableArray();

    activate() {
        var query = missionsvc.EQ.from('ArchivedMissions');
        return missionsvc.manager.executeQuery(query)
            .then(m => {
                this.missions(m.results);
                return true;
            }); // TODO: .fail()
    }
}

export = ArchiveVM;