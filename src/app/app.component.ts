import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCardListComponent } from './product-card-list/product-card-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ProductCardListComponent],
})
export class AppComponent {}
