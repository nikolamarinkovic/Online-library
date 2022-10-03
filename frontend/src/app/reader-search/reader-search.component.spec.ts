import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderSearchComponent } from './reader-search.component';

describe('ReaderSearchComponent', () => {
  let component: ReaderSearchComponent;
  let fixture: ComponentFixture<ReaderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReaderSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
