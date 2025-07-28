import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule, NgStyle } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  product: any;
  colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];
  selectedColor: string = '';
  carts = [];
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private orderService: OrderService,
    private cartService: CartService,
    private authservice: AuthService
  ) {}
  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe((data) => {
        this.product = data;
      });
    } else {
      console.error('Invalid product ID');
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }
  addCart() {
    const userId = this.authservice.getUserId();
    console.log('User ID from AuthService:', userId); // <-- Ajouté pour debug
    if (!userId) {
      alert('Veuillez vous connecter pour ajouter un produit au panier.');
      return;
    }

    this.cartService.addTocart(this.product);
    alert('Produit ajouté avec succès !');
  }
}
