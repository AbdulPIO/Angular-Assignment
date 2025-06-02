import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OverdueHighlighterDirective } from '../../directives/overdue-highlighter.directive';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, OverdueHighlighterDirective],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

}
