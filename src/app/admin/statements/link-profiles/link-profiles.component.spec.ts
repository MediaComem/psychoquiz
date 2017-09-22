import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProfilesComponent } from './link-profiles.component';

describe('LinkProfilesComponent', () => {
  let component: LinkProfilesComponent;
  let fixture: ComponentFixture<LinkProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
