import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloghubLoaderComponent } from './bloghub-loader.component';

describe('BloghubLoaderComponent', () => {
  let component: BloghubLoaderComponent;
  let fixture: ComponentFixture<BloghubLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloghubLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloghubLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
