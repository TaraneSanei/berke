import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageThemeComponent } from './manage-theme.component';

describe('ManageThemeComponent', () => {
  let component: ManageThemeComponent;
  let fixture: ComponentFixture<ManageThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
