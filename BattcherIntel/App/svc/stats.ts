import ko = require('knockout');
import moment = require('moment');

export class AgentStatsVm {
        userId: number;
        username = ko.observable<string>();
        completed = ko.observable<number>();
        unlocked = ko.observable<number>();
        secretsCompleted = ko.observable<number>();
        secretsIntercepted = ko.observable<number>();
        slowest = ko.observable<Duration>();
        fastest = ko.observable<Duration>();

        constructor(agent: AgentStats) {
                this.userId = agent.userId;
                this.username(agent.username);
                this.completed(agent.completed);
                this.unlocked(agent.unlocked);
                this.secretsCompleted(agent.secretsCompleted);
                this.secretsIntercepted(agent.secretsIntercepted);
                this.slowest(moment.duration(agent.slowest));
                this.fastest(moment.duration(agent.fastest));
        }
}

export class StatsVm {
        week = ko.observable<number>();
        agents = ko.observableArray<AgentStatsVm>();

        constructor(stats: Stats) {
                this.week(stats.week);
                this.agents(stats.agents.map(a => new AgentStatsVm(a)));
        }
}