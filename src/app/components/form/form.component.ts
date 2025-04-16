import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  examForm: FormGroup = this.createFormGroup();
  isEditMode = false;
  examId: number | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.examId = Number(params['id']);
        this.isEditMode = true;
        this.loadExamData();
      }
    });
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      id: [generateUniqueId()],
      // id: [null],
      examName: ['', [Validators.required]],
      examKey: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      examHours: ['', [Validators.required, Validators.min(1)]],
      examDetails: this.fb.array([])
    });
  }

  get examDetails() {
    return this.examForm.get('examDetails') as FormArray;
  }

  addExamDetail() {
    const detail = this.fb.group({
      subject: ['', Validators.required],
      marks: ['', [Validators.required, Validators.min(1)]],
      no_of_questions: ['', [Validators.required, Validators.min(1)]]
    });
    this.examDetails.push(detail);
  }

  removeExamDetail(index: number) {
    this.examDetails.removeAt(index);
  }

  onSubmit() {
    this.submitted = true;
    if (this.examForm.valid) {
      const examData = this.examForm.value;


      if (this.isEditMode) {
        examData.id = this.examId;
        this.examService.updateExam(examData).subscribe({
          next: () => {
            alert('Exam updated successfully');
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error updating exam:', error);
            alert('Failed to update exam. Please try again.');
          }
        });
      } else {

        examData.id = generateUniqueId();
        this.examService.createExam(examData).subscribe({
          next: () => {
            alert('Exam created successfully');
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error creating exam:', error);
            alert('Failed to create exam. Please try again.');
          }
        });
      }
    }
  }

  private loadExamData() {
    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (exam) => {
          // debugging line
          console.log('Exam to edit: ', exam);


          while (this.examDetails.length) {
            this.examDetails.removeAt(0);
          }

          this.examForm.patchValue({
            id: exam.id,
            examName: exam.examName,
            examKey: exam.examKey,
            phone: exam.phone,
            examHours: exam.examHours
          });

          // while (this.examDetails.length) {
          //   this.examDetails.removeAt(0);
          // }

          exam.examDetails.forEach(detail => {
            this.examDetails.push(
              this.fb.group({
                subject: [detail.subject, Validators.required],
                marks: [detail.marks, [Validators.required, Validators.min(1)]],
                no_of_questions: [detail.no_of_questions, [Validators.required, Validators.min(1)]]
              })
            );
          });
        },
        error: (error) => {
          console.error('Error loading exam:', error);
          alert('Failed to load exam details. Please try again.');
          this.router.navigate(['/']);
        }
      });
    }
  }
}

// helper function
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return String(timestamp + randomNum);
}