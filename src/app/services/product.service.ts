import { Injectable } from '@angular/core';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _data = [
    new Product({
      name: 'A產品',
      authors: ['作者A', '作者B', '作者C'],
      company: '博碩文化',
      imgUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
      price: 1580,
    }),
    new Product({
      name: 'B產品',
      authors: ['作者A', '作者B', '作者C'],
      company: '博碩文化',
      imgUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
      price: 1580,
    }),
    new Product({
      name: 'C產品',
      authors: ['作者A', '作者B', '作者C'],
      company: '博碩文化',
      imgUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
      price: 1580,
    }),
    new Product({
      name: 'D產品',
      authors: ['作者A', '作者B', '作者C'],
      company: '博碩文化',
      imgUrl: 'https://api.fnkr.net/testimg/200x200/DDDDDD/999999/?text=img',
      price: 1580,
    }),
  ];

  getList(): Product[] {
    return this._data;
  }
}
