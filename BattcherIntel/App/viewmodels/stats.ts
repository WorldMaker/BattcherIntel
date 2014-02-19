import ko = require('knockout');
import mission = require('../svc/mission');
import stats = require('../svc/stats');
import toastr = require('toastr');

class StatsVm {
        stats = ko.observable<stats.StatsVm>();

        activate(settings: any) {
                return mission.stats().then(s => this.stats(new stats.StatsVm(s)))
                        .fail(e => toastr.error(e.message, 'Stats Error'));
        }
} 

export = StatsVm;