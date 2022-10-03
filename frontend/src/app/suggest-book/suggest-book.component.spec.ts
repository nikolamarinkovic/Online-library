import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestBookComponent } from './suggest-book.component';

describe('SuggestBookComponent', () => {
  let component: SuggestBookComponent;
  let fixture: ComponentFixture<SuggestBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
