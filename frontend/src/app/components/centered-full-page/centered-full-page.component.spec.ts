import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredFullPageComponent } from './centered-full-page.component';

describe('CenteredFullPageComponent', () => {
  let component: CenteredFullPageComponent;
  let fixture: ComponentFixture<CenteredFullPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenteredFullPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenteredFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
