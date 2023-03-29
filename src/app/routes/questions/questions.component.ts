import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from 'src/app/core/services/layout.service';

import { QuestionService } from 'src/app/core/services/question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  questionForm: FormGroup = this.fb.group({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
    question7: '',
  });

  durationToggle: boolean = false;
  scrolled: number = 0;

  fullscreen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private layout: LayoutService
  ) {}

  changeScrollPosition(event: any) {
    const winScroll = event.currentTarget.scrollTop;
    const height =
      event.currentTarget.scrollHeight - event.currentTarget.clientHeight;
    this.scrolled = (winScroll / height) * 100;
  }

  enoughDuration(value: boolean): void {
    this.durationToggle = value;
  }

  previousQuestion(element: string): void {
    this.layout.scrollToElement(element);
  }

  nextQuestion(element: string): void {
    this.layout.scrollToElement(element);
  }

  async saveQuestion(): Promise<void> {
    this.questionForm.markAllAsTouched();

    const question = {
      ...this.questionForm.value,
    };
    await this.questionService.saveQuestion(question);
    this.questionForm.reset();
  }
}
