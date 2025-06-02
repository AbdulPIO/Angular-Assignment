import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectFormModalComponent } from '../project-form-modal/project-form-modal.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectFormModalComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  showProjectModal = false;
  selectedProject?: Project;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.taskService.getProjects().subscribe(
      projects => this.projects = projects,
      error => console.error('Error loading projects: ', error)
    );
  }

  showProjectForm() {
    this.selectedProject = undefined;
    this.showProjectModal = true;
  }

  editProject(project: Project) {
    this.selectedProject = project;
    this.showProjectModal = true;
  }

  saveProject(project: Project) {
    if (project.id) {
      this.taskService.updateProject(project.id, project).subscribe(
        () => {
          this.loadProjects();
          this.closeProjectModal();
        },
        error => console.error('Error updating project: ', error)
      );
    } else {
      this.taskService.createProject(project).subscribe(
        () => {
          this.loadProjects();
          this.closeProjectModal();
        },
        error => console.error('Error creating project: ', error)
      );
    }
  }

  deleteProject(projectId: string) {
    const confirmDelete = confirm(`Are you sure you want to delete the project?`)
    if (confirmDelete) {
      this.taskService.deleteProject(projectId).subscribe(
        () => this.loadProjects(),
        error => console.error('Error deleting project: ', error)
      );
    }
  }

  closeProjectModal() {
    this.showProjectModal = false;
    this.selectedProject = undefined;
  }

}
