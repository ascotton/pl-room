export interface Student {
    uuid: string;
    first_name: string;
    last_name: string;
    display_name: string;
    recent_homework: Homework;
}

export enum HomeworkStatus {
    completed = 'completed',
    assigned = 'assigned',
    reviewed = 'reviewed',
}

export interface Homework {
    uuid: string;
    status: HomeworkStatus;
    assigned_date: Date;
    due_date: Date;
}
