import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../models/task.interface';

@Component({
  selector: 'app-project-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form-modal.component.html',
  styleUrl: './project-form-modal.component.scss'
})
export class ProjectFormModalComponent implements OnInit {
  @Input() project?: Project;
  @Output() save = new EventEmitter<Project>();
  @Output() closeModal = new EventEmitter<void>();

  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.project) {
      this.projectForm.patchValue({
        projectTitle: this.project.projectTitle
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const projectData: Project = {
        id: this.project?.id,
        projectTitle: this.projectForm.get('projectTitle')?.value
      };
      this.save.emit(projectData);
    }
  }

  onBackdropClick() {
    if (confirm('Are you sure you want to exit without saving?')) {
      this.closeModal.emit();
    }
  }

  onCloseClick() {
    if (confirm('Are you sure you want to exit without saving?')) {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    if (confirm('Are you sure you want to exit without saving?')) {
      this.closeModal.emit();
    }
  }

}
