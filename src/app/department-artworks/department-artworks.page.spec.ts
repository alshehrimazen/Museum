import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentArtworksPage } from './department-artworks.page';

describe('DepartmentArtworksPage', () => {
  let component: DepartmentArtworksPage;
  let fixture: ComponentFixture<DepartmentArtworksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentArtworksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
