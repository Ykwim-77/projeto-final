import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsqueceuSenha } from './esqueceu-senha';

describe('EsqueceuSenha', () => {
  let component: EsqueceuSenha;
  let fixture: ComponentFixture<EsqueceuSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsqueceuSenha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsqueceuSenha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
