import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmListDeleteComponent} from './confirm-list-delete.component';

describe('ConfirmListDeleteComponent', () => {
  let component: ConfirmListDeleteComponent;
  let fixture: ComponentFixture<ConfirmListDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmListDeleteComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
