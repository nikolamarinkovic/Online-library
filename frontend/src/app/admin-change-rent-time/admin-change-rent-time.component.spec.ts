import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeRentTimeComponent } from './admin-change-rent-time.component';

describe('AdminChangeRentTimeComponent', () => {
  let component: AdminChangeRentTimeComponent;
  let fixture: ComponentFixture<AdminChangeRentTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChangeRentTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangeRentTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
