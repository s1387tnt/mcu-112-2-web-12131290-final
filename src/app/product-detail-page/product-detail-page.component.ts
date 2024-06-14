import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../model/product';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPageComponent {
  product = new Product({
    id: 1,
    name: 'A產品',
    authors: ['作者A', '作者B', '作者C'],
    company: '博碩文化',
    imgUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
    price: 1580,
  });

  private router = inject(Router);

  onBack(): void {
    this.router.navigate(['products']);
  }

  onShop(): void {
    this.router.navigate(['shopping-cart']);
  }
}
