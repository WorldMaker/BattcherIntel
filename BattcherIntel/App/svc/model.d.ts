interface Agent {
    id: number;
    username: string;
}

interface Report {
    id: number;
    type: number;
    created: string;
    comments: string;
    agent: Agent;
}

interface Mission {
    id: number;
    missionCode: string;
    missionText: string;
    unlocked: string;
    completed: string;
    isArchived: boolean;
    agent: Agent;
    targetAgent: Agent;
    pack: { name: string };
    reports: Report[];
}

interface DashboardRecentReport {
    report: Report;
    missionCode: string;
}

interface Dashboard {
    available: number;
    isBirthday: boolean;
    missions: Mission[];
    reports: { report: Report; missionCode: string }[];
}