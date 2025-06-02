// Task interface for defining structure of tasks
export interface Task {
    id?: string;
    title: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Done';
    projectId?: string;
}

// Project interface for defining structure of projects
export interface Project {
    id?: string;
    projectTitle: string;
}