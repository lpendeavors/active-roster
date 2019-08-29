import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwriteConfirmDialogComponent } from './overwrite-confirm-dialog.component';

describe('OverwriteConfirmDialogComponent', () => {
  let component: OverwriteConfirmDialogComponent;
  let fixture: ComponentFixture<OverwriteConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverwriteConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwriteConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
