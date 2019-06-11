import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsdfContainerComponent } from './asdf-container.component';

describe('AsdfContainerComponent', () => {
  let component: AsdfContainerComponent;
  let fixture: ComponentFixture<AsdfContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsdfContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsdfContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
