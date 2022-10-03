import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeBookDataComponent } from './admin-change-book-data.component';

describe('AdminChangeBookDataComponent', () => {
  let component: AdminChangeBookDataComponent;
  let fixture: ComponentFixture<AdminChangeBookDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChangeBookDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangeBookDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
