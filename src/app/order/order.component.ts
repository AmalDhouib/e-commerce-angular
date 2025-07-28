import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  status!: string;
  constructor(private orderservice: OrderService,private authService:AuthService) {}
  ngOnInit(): void {
    this.loadOrdersByUser();
  }

  loadOrder() {
    this.orderservice.getOrders().subscribe({
      next: (data: any) => {
        this.orders = data;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        this.orders.forEach((order) => {
          if (Array.isArray(order.products)) {
            order.products.forEach((p: any) => {
              const found = cart.find((c: any) => c.id === p.id);
              p.cartQuantity = found ? found.cartQuantity : 1;
            });
          }
        });
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      },
    });
  }

  calculatePrice() {
    for (let order of this.orders) {
      let total = 0;

      for (let product of order.products) {
        const quantity = product.cartQuantity;
        total += product.price * quantity;
      }

      order.TotalPrice = total;
    }
  }
  delete(order: any) {
    this.orderservice.deleteOrder(order.id).subscribe({
      next: () => {
        console.log('Removed successfully!');
        this.loadOrder();
      },
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
  loadOrdersByUser(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.orders = [];
      return;
    }
    this.orderservice.getOrdersByUser(+userId).subscribe({
      next: (data: any[]) => {
        this.orders = data;
      },
      error: (err) => console.error('Erreur chargement commandes', err),
    });
  }
}
