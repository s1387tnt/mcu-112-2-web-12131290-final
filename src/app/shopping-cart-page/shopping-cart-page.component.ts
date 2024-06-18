import { CurrencyPipe, JsonPipe } from '@angular/common';
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

import { filter, map } from 'rxjs';
import { IOrderDetailForm } from '../interface/order-detail-form.interface';
import { Product } from '../model/product';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-page',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CurrencyPipe],
  templateUrl: './shopping-cart-page.component.html',
  styleUrl: './shopping-cart-page.component.css',
})
export class ShoppingCartPageComponent implements OnInit {
  readonly ShoppingCartService = inject(ShoppingCartService);

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

  ngOnInit(): void {
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
    console.log('save');
  }
}
