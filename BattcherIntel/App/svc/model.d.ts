interface Agent {
    id: number;
    username: string;
}

interface Report {
    id: number;
    type: number;
    created: string;
    comments: string;
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

interface Dashboard {
    available: number;
    missions: Mission[];
}