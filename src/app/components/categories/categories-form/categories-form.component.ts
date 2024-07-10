import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss'
})
export class CategoriesFormComponent {
  @Input() title: string = '';
  @Input() toUpdateCategory: ICategory = {};
  @Output() callParentEvent: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  formValid: boolean = false;

  ngOnInit(): void {
    this.updateFormValidity();
  }

  updateFormValidity(): void {
    const isValidName = this.toUpdateCategory.name != null && this.toUpdateCategory.name.trim() !== '';
    const isValidDescription = this.toUpdateCategory.description != null && this.toUpdateCategory.description.trim() !== '';
  
    this.formValid = isValidName && isValidDescription;
  }

  addEdit()  {
    if (this.formValid) {
      this.callParentEvent.emit(this.toUpdateCategory);
    }
  }

}
