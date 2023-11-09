import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewvideoPage } from './viewvideo.page';

describe('ViewvideoPage', () => {
  let component: ViewvideoPage;
  let fixture: ComponentFixture<ViewvideoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewvideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
