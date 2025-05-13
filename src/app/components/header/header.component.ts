import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isFormRoute = false;
  currentExamId: number | null = null;

  // Button validation variables
  formValid = false;
  formDirty = false;

  constructor(
    private router: Router,
    private examService: ExamService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isFormRoute = this.router.url.includes('/form');
      // Extract exam ID from URL if present
      const urlParts = this.router.url.split('/');
      this.currentExamId = urlParts.length > 2 ? +urlParts[2] : null;
    });

    /**
     * Listens for custom form state update events from form component.
     */
    window.addEventListener('formStateUpdate', (e: Event) => {
      const customEvent = e as CustomEvent<{ isValid: boolean; isDirty: boolean }>;
      this.formValid = customEvent.detail.isValid;
      this.formDirty = customEvent.detail.isDirty;
    })
  }

  /**
   * Navigates to the add form page.
   */
  onAdd() {
    this.router.navigate(['/form']);
  }

  /**
   * Dispatches a submit event to trigger form submission from the form component.
   */
  onUpdate() {
    // This function will trigger form submission
    const formElement = document.querySelector('form');
    if (formElement) {
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true
      });
      formElement.dispatchEvent(submitEvent);
    }
  }

  /**
   * Deletes the current exam after confirmation.
   */
  onDelete() {
    console.log("delete from header triggered");

    if (this.currentExamId) {
      if (confirm('Are you sure you want to delete this exam?')) {
        this.examService.deleteExam(this.currentExamId).subscribe({
          next: () => {
            this.router.navigate(['/']);
            alert('Exam deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting exam:', error);
            alert('Failed to delete exam. Please try again.');
          }
        });
      }
    }
  }

  /**
   * Navigates back to home with confirmation if form is dirty.
   */
  onBack() {
    // Check if there are unsaved changes
    const hasUnsavedChanges = document.querySelector('form.ng-dirty');

    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
} 