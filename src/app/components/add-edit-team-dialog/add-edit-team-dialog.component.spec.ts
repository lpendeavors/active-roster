import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTeamDialogComponent } from './add-edit-team-dialog.component';

describe('AddEditTeamDialogComponent', () => {
  let component: AddEditTeamDialogComponent;
  let fixture: ComponentFixture<AddEditTeamDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTeamDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
