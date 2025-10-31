import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { QuestionService } from '../../Services/question.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  standalone: false
})
export class QuestionComponent implements OnInit {
  technologies: string[] = [];
  questions: any[] = [];
  selectedTechnology: string = '';
  loading: boolean = false;
  error: string = '';
  userEmail: string | null = '';
  expandedAnswers: Set<number> = new Set();

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.loadTechnologies();
  }

  loadTechnologies(): void {
    this.loading = true;
    this.error = '';
    
    this.questionService.getAllQuestions().subscribe(
      (data) => {
        this.loading = false;
        if (data[0]?.technologies) {
          this.technologies = data[0].technologies.map((t: any) => t.name);
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Failed to load technologies';
        console.error(error);
      }
    );
  }

  onTechnologyChange(): void {
    if (this.selectedTechnology) {
      this.loadQuestions();
    } else {
      this.questions = [];
    }
  }

  loadQuestions(): void {
    this.loading = true;
    this.error = '';
    this.questions = [];
    this.expandedAnswers.clear();

    this.questionService.getQuestionsByTechnology(this.selectedTechnology).subscribe(
      (data) => {
        this.loading = false;
        this.questions = data;
      },
      (error) => {
        this.loading = false;
        this.error = `Failed to load questions: ${error.error?.message || error.message}`;
        console.error(error);
      }
    );
  }

  toggleAnswer(index: number): void {
    if (this.expandedAnswers.has(index)) {
      this.expandedAnswers.delete(index);
    } else {
      this.expandedAnswers.add(index);
    }
  }

  isAnswerExpanded(index: number): boolean {
    return this.expandedAnswers.has(index);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
