import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Project, Task } from "../models/task.interface";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    // Project CRUD operations
    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projects`);
    }

    createProject(project: Project): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/projects`, project);
    }

    updateProject(id: string, project: Project): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, project);
    }

    deleteProject(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
    }

    // Task CRUD operations
    getTasks(projectId: string): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
            map(tasks => tasks.filter(task => task.projectId === projectId))
        );
    }

    createTask(projectId: string, task: Task): Observable<Task> {
        const taskWithProjectId = { ...task, projectId };
        return this.http.post<Task>(`${this.apiUrl}/tasks`, taskWithProjectId);
    }

    updateTask(projectId: string, taskId: string, task: Task): Observable<Task> {
        const taskWithProjectId = { ...task, projectId };
        return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, taskWithProjectId);
    }

    deleteTask(projectId: string, taskId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
    }
}