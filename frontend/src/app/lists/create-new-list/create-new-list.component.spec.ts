import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateNewListComponent} from './create-new-list.component';

describe('CreateNewListComponent', () => {
  let component: CreateNewListComponent;
  let fixture: ComponentFixture<CreateNewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewListComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
