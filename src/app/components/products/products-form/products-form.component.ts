import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ICategory, IProduct } from '../../../interfaces';
import { CategoryService } from '../../../services/category.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() toUpdateProduct: IProduct = {};
  @Output() callParentEvent: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  categories: ICategory[] = [];
  selectedCategoryId: number | null = null;

  constructor(private categoryService: CategoryService, private cdr: ChangeDetectorRef) {}

  formValid: boolean = false;

  ngOnInit(): void {
    this.initializeCategories();
    this.restoreSelectedCategory();
    this.updateFormValidity();
  }
  
  initializeCategories(): void {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    } else {
      this.loadCategories();
    }
  }
  
  loadCategories(): void {
    this.categoryService.items$.subscribe(categories => {
      this.categories = categories;
      localStorage.setItem('categories', JSON.stringify(categories)); 
      this.restoreSelectedCategory();
      this.cdr.detectChanges();
    });
  }
  
  restoreSelectedCategory(): void {
    if (this.toUpdateProduct?.category?.id) {
      this.selectedCategoryId = this.toUpdateProduct.category.id;
    }
  }

  updateCategory(newCategoryId: number | null): void {
    this.selectedCategoryId = newCategoryId;
    this.toUpdateProduct.category = this.categories.find(cat => cat.id === newCategoryId) || undefined;
    localStorage.setItem('selectedCategoryId', JSON.stringify(newCategoryId));
  }

  updateFormValidity(): void {
    const isValidName = this.toUpdateProduct.name != null && this.toUpdateProduct.name.trim() !== '';
    const isValidDescription = this.toUpdateProduct.description != null && this.toUpdateProduct.description.trim() !== '';
    const isValidPrice = this.toUpdateProduct.price != null && this.toUpdateProduct.price > 0;
    const isValidStock = this.toUpdateProduct.stock != null && this.toUpdateProduct.stock >= 0;
    const isValidCategory = this.selectedCategoryId != null;
  
    this.formValid = isValidName && isValidDescription && isValidPrice && isValidStock && isValidCategory;
  }
  
  addEdit(): void {
    if (this.formValid) {
      this.callParentEvent.emit(this.toUpdateProduct);
    }
  }

  trackByFn(index: number, item: ICategory): number {
    return item.id!;
  }
}
