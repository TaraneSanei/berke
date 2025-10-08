import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { WindowDirective } from "../shared/directives/window.directive";
import { Emotion, Journal } from '../models/data.models';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as jalali from 'jalaali-js';
import { JalaliCalendarComponent } from '../shared/components/jalali-calendar/jalali-calendar.component';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { AddJournal, LoadJournal } from '../state/journal/journal.actions';
import { selectJournal } from '../state/journal/journal.selector';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { EmotionIconComponent } from '../shared/components/emotion-icon/emotion-icon.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { selectEmotion } from '../state/emotion/emotion.selector';
import { LoadEmotions } from '../state/emotion/emotion.actions';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from "primeng/button";

@Component({
  selector: 'app-journal',
  imports: [
    CommonModule,
    WindowDirective,
    TextareaModule,
    FormsModule,
    ReactiveFormsModule,
    JalaliCalendarComponent,
    PersianDigitsPipe,
    EmotionIconComponent,
    MultiSelectModule,
    FloatLabelModule,
    DatePickerModule,
    Button
],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent implements OnInit {

  selectedDate = signal<Date | null>(new Date());
  currentYear = 0; //this is the jalali year used for building the calendar
  currentMonth = 0; //this is the jalali month used for building the calendar
  eventsMap: Record<string, any[]> = {};
  journals = signal<Journal[]>([]);
  emotions = signal<Emotion[]>([])
  newJournal: Journal = {
    note: '',
    dateTime: this.selectedDate() || new Date(),
    emotionalStatus: []
  };

  ngOnInit() {
    const now = new Date();

    const { jy, jm, jd } = jalali.toJalaali(now);
    this.currentYear = jy;
    this.currentMonth = jm;
    // Example: build eventsMap from arrays of journals/sessions
    // Suppose you have arrays `journals` and `sessions` with js Date
    // this.eventsMap = makeMapFromEntries([...journals, ...sessions]);
  }

  constructor(private store: Store<AppState>) {

    effect(() => {
      this.onDateSelected(this.selectedDate()!);
      this.store.dispatch(LoadEmotions())
    })

    effect(() => {
      const journalData = this.store.selectSignal(selectJournal)
      this.journals.set(journalData())
      const emotionData = this.store.selectSignal(selectEmotion)
      this.emotions.set(emotionData())

    })

  }

  onDateSelected(gregorian: Date) {
    console.log('in journal componnent selected jalali', 'gregorian', gregorian);
    const year = gregorian.getFullYear();
    const month = String(gregorian.getMonth() + 1).padStart(2, '0');
    const day = String(gregorian.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    this.store.dispatch(LoadJournal({ date: localDate }));
  }

  removeEmotion(item: Emotion, selected: Emotion[]) {
  const updated = selected.filter(s => s.emotion !== item.emotion);
  this.newJournal.emotionalStatus = [...updated];
}
saveJournal() {
  this.store.dispatch(AddJournal({ journal: this.newJournal }));
  console.log('new journal', this.newJournal);
  this.newJournal = {
    note: '',
    dateTime: this.selectedDate() || new Date(),
    emotionalStatus: []
  };
}

}


