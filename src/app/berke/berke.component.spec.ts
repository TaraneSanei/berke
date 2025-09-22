import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkeComponent } from './berke.component';

describe('BerkeComponent', () => {
  let component: BerkeComponent;
  let fixture: ComponentFixture<BerkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BerkeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BerkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
