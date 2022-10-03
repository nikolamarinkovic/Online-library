import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyDeleteBookComponent } from './admin-modify-delete-book.component';

describe('AdminModifyDeleteBookComponent', () => {
  let component: AdminModifyDeleteBookComponent;
  let fixture: ComponentFixture<AdminModifyDeleteBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModifyDeleteBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyDeleteBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
