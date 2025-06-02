import { Pipe, PipeTransform } from "@angular/core";
import { Task } from "../models/task.interface";

@Pipe({
    name: 'taskStatusFilter',
    standalone: true
})

export class TaskStatusFilterPipe implements PipeTransform {
    transform(tasks: Task[], status: 'Pending' | 'In Progress' | 'Done' | 'All'): Task[] {
        if (!tasks || !status || status == 'All') {
            return tasks;
        }
        return tasks.filter(task => task.status === status);
    }
}