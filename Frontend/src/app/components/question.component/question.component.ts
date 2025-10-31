// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { QuestionService } from '../../Services/question.service';


// @Component({
//   selector: 'app-question',
//   templateUrl: './question.component.html',
//   styleUrls: ['./question.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class QuestionComponent implements OnInit {
//   questions: any[] = [];
//   currentIndex: number = 0;
//   currentQuestion: any = null;
//   loading: boolean = true;

//   constructor(private questionService: QuestionService) { }

//   ngOnInit() {
//     this.loadQuestions();
//   }

//   loadQuestions() {
//     this.questionService.getQuestions().subscribe({
//       next: (data) => {
//         this.questions = data;
//         this.currentQuestion = this.questions[0];
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading questions:', error);
//         this.loading = false;
//       }
//     });
//   }

//   nextQuestion() {
//     if (this.currentIndex < this.questions.length - 1) {
//       this.currentIndex++;
//       this.currentQuestion = this.questions[this.currentIndex];
//     }
//   }

//   prevQuestion() {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//       this.currentQuestion = this.questions[this.currentIndex];
//     }
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { QuestionService } from '../../Services/question.service';
// import { FormsModule } from '@angular/forms'; 

// @Component({
//   selector: 'app-question',
//   templateUrl: './question.component.html',
//   styleUrls: ['./question.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule] 
// })
// export class QuestionComponent implements OnInit {
//   questions: any[] = [];
//   currentIndex: number = 0;
//   currentQuestion: any = null;
//   loading: boolean = true;
  
//   availableTechnologies: string[] = ['Java', 'Angular', 'Android']; 
//   selectedTechnology: string = this.availableTechnologies[0]; 

//   constructor(private questionService: QuestionService) { }

//   ngOnInit() {
//     this.loadQuestions();
//   }

//   onTechnologyChange() {
//     this.questions = [];
//     this.currentIndex = 0;
//     this.currentQuestion = null;
//     this.loadQuestions();
//   }

//   loadQuestions() {
//     if (!this.selectedTechnology) return;
    
//     this.loading = true;
    
//     this.questionService.getQuestionsByTechnology(this.selectedTechnology).subscribe({
//       next: (data) => {
//         if (data && data.length > 0) {
//             this.questions = data;
//             this.currentIndex = 0;
//             this.currentQuestion = this.questions[0];
//         } else {
//             console.warn(`No questions returned for ${this.selectedTechnology}`);
//             this.questions = [];
//             this.currentQuestion = null;
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading questions:', error);
//         this.loading = false;
//       }
//     });
//   }

//   // 💡 RESTORED: nextQuestion() method
//   nextQuestion() {
//     if (this.currentIndex < this.questions.length - 1) {
//       this.currentIndex++;
//       this.currentQuestion = this.questions[this.currentIndex];
//     }
//   }

//   // 💡 RESTORED: prevQuestion() method
//   prevQuestion() {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//       this.currentQuestion = this.questions[this.currentIndex];
//     }
//   }
// }

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