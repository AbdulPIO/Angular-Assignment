import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Handles page number clicks
   * @param page - target page number
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  /**
   * Moves to the previous page if not on the first
   */
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Moves to the next page if not on the last
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}
