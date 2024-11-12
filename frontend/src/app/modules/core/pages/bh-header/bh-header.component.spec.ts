import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhHeaderComponent } from './bh-header.component';

describe('BhHeaderComponent', () => {
  let component: BhHeaderComponent;
  let fixture: ComponentFixture<BhHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BhHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BhHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
