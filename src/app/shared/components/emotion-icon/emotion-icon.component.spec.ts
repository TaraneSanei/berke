import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionIconComponent } from './emotion-icon.component';

describe('EmotionIconComponent', () => {
  let component: EmotionIconComponent;
  let fixture: ComponentFixture<EmotionIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
