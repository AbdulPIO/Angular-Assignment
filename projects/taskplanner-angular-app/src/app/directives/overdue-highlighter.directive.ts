import { Directive, OnInit, ElementRef, Input } from "@angular/core";
import { Task } from "../models/task.interface";

@Directive({
    selector: '[appOverdue]',
    standalone: true
})
export class OverdueHighlighterDirective implements OnInit {
    @Input() task!: Task;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        if (this.isOverDue()) {
            this.el.nativeElement.style.backgroundColor = '#ffebee';
            this.el.nativeElement.style.borderLeft = '4px solid #f44336';
        }
    }

    private isOverDue(): boolean {
        if (this.task.status === 'Done') return false;

        const today = new Date();
        const [month, day, year] = this.task.dueDate.split('/');
        const dueDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));

        return dueDate < today;
    }
}