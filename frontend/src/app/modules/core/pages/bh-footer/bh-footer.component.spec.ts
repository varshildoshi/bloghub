import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhFooterComponent } from './bh-footer.component';

describe('BhFooterComponent', () => {
  let component: BhFooterComponent;
  let fixture: ComponentFixture<BhFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BhFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BhFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
