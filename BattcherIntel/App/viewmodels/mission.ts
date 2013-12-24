import mission = require('../svc/mission');

class MissionDetailsVM extends mission.MissionVM {
    constructor() {
        super();
    }

    activate(code) {
        return mission.getMission(code).then(m => {
            this.id = m.id;
            this.update(m);
        });
    }
}

export = MissionDetailsVM;