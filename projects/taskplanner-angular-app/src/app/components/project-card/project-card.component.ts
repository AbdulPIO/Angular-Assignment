import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { Project, Task } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskStatusFilterPipe } from '../../pipes/task-status-filter.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, TaskFormModalComponent, TaskStatusFilterPipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<string>();

  tasks: Task[] = [];
  showTaskModal = false;
  selectedTask?: Task;
  isExpanded = false;
  selectedStatus: 'All' | 'Pending' | 'In Progress' | 'Done' = 'All';

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  loadTasks() {
    if (this.project.id) {
      this.taskService.getTasks(this.project.id).subscribe(
        (tasks) => {
          this.tasks = tasks;

          //Explicitly reset selectedStatus to trigger pipe binding
          this.selectedStatus = 'All';
        },
        (error) => console.error('Error loading tasks: ', error)
      );
    }
  }

  showTaskForm() {
    this.selectedTask = undefined;
    this.showTaskModal = true;
  }

  editTask(task: Task) {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  saveTask(task: Task) {
    if (this.project.id) {
      if (task.id) {
        this.taskService.updateTask(this.project.id, task.id, task).subscribe(
          () => {
            this.loadTasks();
            this.closeTaskModal();
          },
          error => console.error('Error updating task: ', error)
        );
      } else {
        this.taskService.createTask(this.project.id, task).subscribe(
          () => {
            this.loadTasks();
            this.closeTaskModal();
          },
          error => console.error('Error creating task: ', error)
        );
      }
    }
  }

  deleteTask(taskId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete this task?`);
    if (confirmDelete) {
      if (this.project.id) {
        this.taskService.deleteTask(this.project.id, taskId).subscribe(
          () => this.loadTasks(),
          error => console.error('Error deleting task: ', error)
        );
      }
    }

  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = undefined;
  }

  editProject() {
    this.edit.emit(this.project);
  }

  deleteProject() {
    if (this.project.id) {
      this.delete.emit(this.project.id);
    }
  }
}
