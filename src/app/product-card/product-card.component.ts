import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  productName = 'A產品';
  authors = '作者A、作者B、作者C';
  company = '博碩文化';
}
