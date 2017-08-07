import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementsComponent } from './statements.component';

describe('StatementsComponent', () => {
  let component: StatementsComponent;
  let fixture: ComponentFixture<StatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
