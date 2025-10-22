import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { WindowDirective } from "../shared/directives/window.directive";
import { CalendarSummary, Emotion, Journal, MeditationSession } from '../models/data.models';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as jalali from 'jalaali-js';
import { JalaliCalendarComponent } from '../shared/components/jalali-calendar/jalali-calendar.component';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { AddJournal, DeleteJournal, EditJournal, LoadJournal } from '../state/journal/journal.actions';
import { selectJournal } from '../state/journal/journal.selector';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { EmotionIconComponent } from '../shared/components/emotion-icon/emotion-icon.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from "primeng/button";
import { PersianDigitsDirective } from "../shared/directives/persian-digits.directive";
import { BerkeService } from '../shared/services/berke.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LoadMeditationSession } from '../state/meditationsSessions/meditationSessions.actions';
import { selectMeditationSessions, SelectMeditationSessions } from '../state/meditationsSessions/meditationSessions.selector';
import { DataService } from '../shared/services/data.service';


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
    Button,
    PersianDigitsDirective,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent implements OnInit {

  combinedEntries: any;
  berkeService = inject(BerkeService);
  emotions = this.berkeService.emotions
  courses = this.berkeService.courses
  selectedDate = signal<Date | null>(new Date());
  calendarView = signal<{ jy: number, jm: number }>({ jy: 0, jm: 0 }); // Tracks current displayed month/year
  monthSummaryMap = signal<Map<string, CalendarSummary>>(new Map()); // Holds the fetched data
  journals = signal<Journal[]>([]);
  meditationSessions = signal<MeditationSession[]>([])
  newJournal: Journal = {
    note: '',
    dateTime: this.selectedDate() || new Date(),
    emotionalStatus: []
  };

  editing = signal<{ type: 'journal' | 'meditation'; id: number } | undefined>(undefined)
  expanded = signal<{ type: 'journal' | 'meditation'; id: number } | undefined>(undefined)
  editableJournal: Journal = {
    note: '',
    dateTime: this.selectedDate() || new Date(),
    emotionalStatus: []
  };



  ngOnInit() {
    const now = new Date();
    const { jy, jm, jd } = jalali.toJalaali(now);
    this.calendarView.set({ jy, jm });
  }

  onMonthChange(date: { year: number, month: number }) {
    // This updates the signal, which triggers the effect above
    this.calendarView.set({ jy: date.year, jm: date.month });
  }

  constructor(private store: Store<AppState>, private confirmationService: ConfirmationService, private dataService: DataService) {

    effect(() => {
      this.onDateSelected(this.selectedDate()!);
      this.berkeService.loadEmotions()
    })

    effect(() => {
      const { jy, jm } = this.calendarView();
      if (jy > 0 && jm > 0) {
        this.fetchMonthSummary(jy, jm);
      }
    });

    effect(() => {
      const journalData = this.store.selectSignal(selectJournal)
      this.journals.set(journalData())
      const meditationSessionsData = this.store.selectSignal(selectMeditationSessions)
      this.meditationSessions.set(meditationSessionsData())
    })

    this.combinedEntries = computed(() => {
      const journalItems = this.journals();
      const sessionItems = this.meditationSessions();

      const all = [
        ...journalItems.map(j => ({ ...j, type: 'journal' })),
        ...sessionItems.map(s => ({ ...s, type: 'meditation' })),
      ];

      // Sort by datetime
      return all.sort((a, b) =>
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
    });

  }

  private fetchMonthSummary(jy: number, jm: number) {
    const { startDate, endDate } = this.berkeService.getGregorianDateRange(jy, jm);

    this.dataService.getMonthSummary(startDate, endDate).subscribe({
      next: (summaryData: CalendarSummary[]) => {
        const newMap = new Map<string, CalendarSummary>();
        summaryData.forEach(item => {
          newMap.set(item.date, item);
        });
        this.monthSummaryMap.set(newMap);
        console.log('Month summary map updated:', this.monthSummaryMap());
      },
      error: (err) => {
        console.error('Error fetching month summary:', err);
        this.monthSummaryMap.set(new Map());
      }
    });
  }

  onDateSelected(gregorian: Date) {
    console.log('in journal componnent selected jalali', 'gregorian', gregorian);
    const year = gregorian.getFullYear();
    const month = String(gregorian.getMonth() + 1).padStart(2, '0');
    const day = String(gregorian.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    this.store.dispatch(LoadJournal({ date: localDate }));
    this.store.dispatch(LoadMeditationSession({ date: localDate }))
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

  deleteJournal(event: Event, journal: Journal) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'نوشته ها بخشی از داستان زندگیت هستن. مطمئنی که می خواهی این نوشته رو حذف کنی؟',
      icon: 'pi pi-trash',
      rejectLabel: 'نه',
      rejectButtonProps: {
        label: 'نه',
        severity: 'primary',
        outlined: true,
        rounded: true
      },
      acceptButtonProps: {
        label: 'حذف',
        severity: 'danger',
        rounded: true
      },

      accept: () => {
        this.store.dispatch(DeleteJournal({ journal }));
      },
      reject: () => {
      },
    });
  }


  toggleEdit(journal: Journal) {
    if (!this.editing()) {
      this.editing.set({type: 'journal', id: journal.id!})
      this.editableJournal = {
        note: journal.note,
        id: journal.id,
        dateTime: new Date(journal.dateTime),
        emotionalStatus: journal.emotionalStatus,
      }
      console.log('editableJournal', this.editableJournal);
    } else {
      this.editing.set(undefined)
    }
  }

  editJournal() {
    this.store.dispatch(EditJournal({ journal: this.editableJournal }));
    this.editableJournal = {
      note: "",
      id: undefined,
      dateTime: new Date(),
      emotionalStatus: [],
    }
    this.editing.set(undefined)

  }

  toggleExpanded(session:MeditationSession){
  const current = this.expanded();
  if (!current || current.id !== session.id) {
      this.expanded.set( {type: 'meditation', id: session.id!})
    } else {
      this.expanded.set(undefined)
      console.log('the session should collapse now')
    }
  }
}


