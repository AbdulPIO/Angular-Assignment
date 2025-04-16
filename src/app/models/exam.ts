export interface ExamDetail {
    subject: string;
    marks: number;
    no_of_questions: number;
}

export interface Exam {
    id: number;
    examName: string;
    examKey: string;
    phone: string;
    examHours: number;
    examDetails: ExamDetail[];
} 