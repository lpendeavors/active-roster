import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlayerDialogComponent } from './add-edit-player-dialog.component';

describe('AddEditPlayerDialogComponent', () => {
  let component: AddEditPlayerDialogComponent;
  let fixture: ComponentFixture<AddEditPlayerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPlayerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
