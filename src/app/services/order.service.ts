import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartSaveService {
  private readonly url = 'http://localhost:3000/orders';

  private readonly httpClient = inject(HttpClient);

  saveOrder(order: any): Observable<any> {
    return this.httpClient.post<any>(this.url, order);
  }
}
