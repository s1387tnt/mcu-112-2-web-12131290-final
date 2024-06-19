import { CurrencyPipe, JsonPipe, NgFor } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IOrderForm } from '../interface/order-form.interface';
import { ShoppingCartService } from './../services/shopping-cart.service';

import { filter, map } from 'rxjs';
import { IOrderDetailForm } from '../interface/order-detail-form.interface';
import { Product } from '../model/product';
import { ShoppingCartSaveService } from '../services/order.service';

@Component({
  selector: 'app-shopping-cart-page',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CurrencyPipe, NgFor],
  templateUrl: './shopping-cart-page.component.html',
  styleUrl: './shopping-cart-page.component.css',
})
export class ShoppingCartPageComponent implements OnInit {
  readonly ShoppingCartService = inject(ShoppingCartService);
  readonly ShoppingCartSaveService = inject(ShoppingCartSaveService);
  readonly form = new FormGroup<IOrderForm>({
    name: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    address: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    phone: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.pattern('\\d{8,10}')],
    }),
    details: new FormArray<FormGroup<IOrderDetailForm>>([]),
  });

  get name(): FormControl<string | null> {
    return this.form.get('name') as FormControl<string | null>;
  }

  get address(): FormControl<string | null> {
    return this.form.get('address') as FormControl<string | null>;
  }

  get phone(): FormControl<string | null> {
    return this.form.get('phone') as FormControl<string | null>;
  }

  get details(): FormArray<FormGroup<IOrderDetailForm>> {
    return this.form.get('details') as FormArray<FormGroup<IOrderDetailForm>>;
  }

  private readonly destroyRef = inject(DestroyRef);

  totalPrice = 0;

  ngOnInit(): void {
    this.details.valueChanges
      .pipe(
        map((items) => {
          if (items.length === 0) {
            return 0;
          } else {
            return items.reduce((sum, curr) => sum + (curr.price || 0), 0);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((totalPrice) => (this.totalPrice = totalPrice));

    this.setOrderDetail();
  }

  setOrderDetail() {
    for (const item of this.ShoppingCartService.data) {
      const control = new FormGroup<IOrderDetailForm>({
        id: new FormControl<number>(item.id, { nonNullable: true }),
        product: new FormControl<Product>(item.product, { nonNullable: true }),
        count: new FormControl<number>(item.count, { nonNullable: true }),
        price: new FormControl<number>(item.product.price * item.count, {
          nonNullable: true,
        }),
      });

      control
        .get('count')
        ?.valueChanges.pipe(
          filter((value) => value !== null),
          map((value) => value * item.product.price),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((price) =>
          control.get('price')?.setValue(price, { EventEmitter: false })
        );

      this.details.push(control);
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const formData = {
        name: this.name.value,
        address: this.address.value,
        phone: this.phone.value,
        details: this.details.value.map((formGroup: any) => ({
          id: formGroup.id,
          product: formGroup.product,
          count: formGroup.count,
          price: formGroup.price,
        })),
      };

      if (this.form.valid) {
        const order = this.form.value;
        this.ShoppingCartSaveService.saveOrder(order).subscribe({
          next: (response) => {
            console.log('Order saved successfully', response);
          },
          error: (error) => {
            console.error('Error saving order', error);
          },
        });
      } else {
        console.error('Form is invalid');
      }
    }
  }

  onDelete(index: number, id: number | undefined): void {
    this.details.removeAt(index);
    this.ShoppingCartService.deleteProduct(id!);
  }
}
