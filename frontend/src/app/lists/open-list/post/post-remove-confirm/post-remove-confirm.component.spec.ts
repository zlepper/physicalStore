import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostRemoveConfirmComponent} from './post-remove-confirm.component';

describe('PostRemoveConfirmComponent', () => {
  let component: PostRemoveConfirmComponent;
  let fixture: ComponentFixture<PostRemoveConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostRemoveConfirmComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRemoveConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
