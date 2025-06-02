import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss'
})
export class TaskFormModalComponent implements OnInit {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();

  taskForm: FormGroup;
  parseddueDate: string = '';

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/)]],
      status: ['Pending', Validators.required]
    });
  }

  ngOnInit() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        dueDate: this.task.dueDate,
        status: this.task.status
      });

      const [mm, dd, yy] = this.task.dueDate.split('/');
      this.parseddueDate = `20${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
  }

  onDatechange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value) {
      const [yyyy, mm, dd] = value.split('-');
      const formatted = `${mm}/${dd}/${yyyy.slice(2)}`;
      this.taskForm.get('dueDate')?.setValue(formatted);
      this.taskForm.get('dueDate')?.markAsTouched();
    }
    this.parseddueDate = value;
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData: Task = {
        id: this.task?.id,
        title: this.taskForm.get('title')?.value,
        dueDate: this.taskForm.get('dueDate')?.value,
        status: this.taskForm.get('status')?.value || 'Pending',
        projectId: this.task?.projectId
      };
      this.save.emit(taskData);
    }
  }

  onBackdropClick() {
    if (confirm('Are you sure you want to close without saving?')) {
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
