import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangeUserDataComponent } from './admin-change-user-data.component';

describe('AdminChangeUserDataComponent', () => {
  let component: AdminChangeUserDataComponent;
  let fixture: ComponentFixture<AdminChangeUserDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChangeUserDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChangeUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
