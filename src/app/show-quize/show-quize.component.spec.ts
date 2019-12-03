import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuizeComponent } from './show-quize.component';

describe('ShowQuizeComponent', () => {
  let component: ShowQuizeComponent;
  let fixture: ComponentFixture<ShowQuizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowQuizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQuizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
