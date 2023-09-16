import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewerPage } from './viewer.page';

describe('ViewerPage', () => {
  let component: ViewerPage;
  let fixture: ComponentFixture<ViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
