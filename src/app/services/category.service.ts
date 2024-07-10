import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base-service';
import { ICategory } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private itemListSubject = new BehaviorSubject<ICategory[]>([]);
  private snackBar = inject(MatSnackBar);

  get items$(): Observable<ICategory[]> {
    return this.itemListSubject.asObservable();
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSubject.next(response);
      },
      error: (error: any) => {
        console.log('error', error);
      }
    });
  }

  public save(item: ICategory) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSubject.next([response, ...this.itemListSubject.getValue()]);
      },
      error: (error: any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    });
  }

  public update(item: ICategory) {
    this.edit(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.itemListSubject.getValue().map(category => category.id === item.id ? item : category);
        this.itemListSubject.next(updatedItems);
      },
      error: (error: any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    });
  }

  public delete(category: ICategory) {
    this.del(category.id).subscribe({
      next: () => {
        const updatedItems = this.itemListSubject.getValue().filter((c: ICategory) => c.id != category.id);
        this.itemListSubject.next(updatedItems);
      },
      error: (error: any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    });
  }
}
