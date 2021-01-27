import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEligibleUserComponent } from './add-eligible-user.component';

describe('AddEligibleUserComponent', () => {
  let component: AddEligibleUserComponent;
  let fixture: ComponentFixture<AddEligibleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEligibleUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEligibleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
