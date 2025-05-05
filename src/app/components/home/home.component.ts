import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam';
import { filter } from 'rxjs';

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

  // variable declaration for sorting and pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  sortColumn: keyof Exam = 'examName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private examService: ExamService,
    private router: Router
  ) { }

  /**
   * Initializes component and loads exams.
   */
  ngOnInit() {
    this.loadExams();
  }

  /**
   * Loads all exams from the API and applies default filter, sort, and pagination.
   */
  loadExams() {
    this.examService.getAllExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        this.sortExams();
        this.applyFilterandPagination();
        // this.filteredExams = data;
      },
      error: () => {
        alert('Failed to load exams');
      }
    });
  }

  applyFilterandPagination() {
    const search = this.searchTerm.toLowerCase();
    const filtered = this.exams.filter(exam =>
      exam.examName.toLowerCase().includes(search) ||
      exam.examKey.toLowerCase().includes(search)
    );

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.filteredExams = filtered.slice(start, end);
  }

  /**
   * Sorts the full exam list based on a column and direction, then reapplies filter and pagination
   * @param column The key of the exam object to sort by
   */
  onSort(column: keyof Exam) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortExams();
    this.applyFilterandPagination();
  }

  /**
   * Applies sorting on th full list of exams.
   */
  private sortExams() {
    this.exams.sort((a, b) => {
      const valA = a[this.sortColumn]!.toString().toLowerCase() || '';
      const valB = b[this.sortColumn]!.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  /**
   * Navigates to edit form for given exam.
   * @param exam The selected exam to edit
   */
  onEdit(exam: Exam) {
    if (exam?.id !== undefined && exam.id !== null) {
      this.router.navigate(['/form', exam.id]);
    } else {
      alert('Invalid exam ID');
    }
  }

  /**
   * Deletes an exam after confirmation
   * @param exam The exam to delete
   */
  onDelete(exam: Exam) {
    console.log("delete triggered");

    if (exam?.id && confirm(`Are you sure you want to delete ${exam.examName}?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: () => {
          this.exams = this.exams.filter(e => e.id !== exam.id);
          this.sortExams();
          this.applyFilterandPagination();
          // this.filteredExams = this.filteredExams.filter(e => e.id !== exam.id);
          alert('Exam deleted successfully');
        },
        error: () => {
          alert('Failed to delete exam');
        }
      });
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilterandPagination();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
} 