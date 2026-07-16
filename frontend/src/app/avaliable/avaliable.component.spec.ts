import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliableComponent } from './avaliable.component';

describe('AvaliableComponent', () => {
  let component: AvaliableComponent;
  let fixture: ComponentFixture<AvaliableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaliableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
