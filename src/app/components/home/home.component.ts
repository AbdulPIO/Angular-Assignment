import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  searchTerm: string = '';

  constructor(
    private examService: ExamService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.examService.getAllExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        this.filteredExams = data;
      },
      error: () => {
        alert('Failed to load exams');
      }
    });
  }

  applyFilter() {
    const search = this.searchTerm.toLowerCase();
    this.filteredExams = this.exams.filter(exam =>
      exam.examName.toLowerCase().includes(search) ||
      exam.examKey.toLowerCase().includes(search)
    );
  }

  onEdit(exam: Exam) {
    if (exam?.id !== undefined && exam.id !== null) {
      this.router.navigate(['/form', exam.id]);
    } else {
      alert('Invalid exam ID');
    }
  }

  onDelete(exam: Exam) {
    console.log("delete triggered");

    if (exam?.id && confirm(`Are you sure you want to delete ${exam.examName}?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: () => {
          this.exams = this.exams.filter(e => e.id !== exam.id);
          this.filteredExams = this.filteredExams.filter(e => e.id !== exam.id);
          alert('Exam deleted successfully');
        },
        error: () => {
          alert('Failed to delete exam');
        }
      });
    }
  }
} 