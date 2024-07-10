import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IProduct } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<IProduct>{
  protected override source: string = 'products';
  private itemListSubject = new BehaviorSubject<IProduct[]>([]);
  private snackBar = inject(MatSnackBar);
  
  get items$(): Observable<IProduct[]> {
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

  public save(item: IProduct) {
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

  public update(item: IProduct) {
    this.edit(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.itemListSubject.getValue().map(product => product.id === item.id ? item : product);
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

  public delete(product: IProduct) {
    this.del(product.id).subscribe({
      next: () => {
        const updatedItems = this.itemListSubject.getValue().filter((c: IProduct) => c.id != product.id);
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
