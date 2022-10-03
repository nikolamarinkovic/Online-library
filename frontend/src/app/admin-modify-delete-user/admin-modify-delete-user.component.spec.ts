import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyDeleteUserComponent } from './admin-modify-delete-user.component';

describe('AdminModifyDeleteUserComponent', () => {
  let component: AdminModifyDeleteUserComponent;
  let fixture: ComponentFixture<AdminModifyDeleteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModifyDeleteUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
