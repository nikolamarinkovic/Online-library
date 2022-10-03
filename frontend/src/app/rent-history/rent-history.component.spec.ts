import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentHistoryComponent } from './rent-history.component';

describe('RentHistoryComponent', () => {
  let component: RentHistoryComponent;
  let fixture: ComponentFixture<RentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
