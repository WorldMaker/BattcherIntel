import ko = require('knockout');
import missionsvc = require('../svc/mission');

class ArchiveVM {
    missions = ko.observableArray();

    activate() {

    }
}

export = ArchiveVM;