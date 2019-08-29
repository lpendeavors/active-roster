import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBirthdaybyDialogComponent } from './edit-birthdayby-dialog.component';

describe('EditBirthdaybyDialogComponent', () => {
  let component: EditBirthdaybyDialogComponent;
  let fixture: ComponentFixture<EditBirthdaybyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBirthdaybyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBirthdaybyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
