import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../features/products/product.model';
import { CartService } from '../services/cart.service';
import { EmptyStateComponent } from '../shared/empty-state/empty-state.component';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, EmptyStateComponent, RouterLink, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  get error(): string {
    return 'Sorry there is no product in your cart !!!Try to discover our products and chose the best for you';
  }
  cartItems: Product[] = [];
  get empty(): boolean {
    return this.cartItems.length === 0;
  }

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}
  totalPrice: number = 0;

  ngOnInit(): void {
    this.loadCart();
  }
  loadCart(): void {
    const userId = this.authService.getUserId()!;
    if (!userId) {
      this.cartItems = [];
      return;
    }

    this.cartItems = this.cartService.getCart(); // this already uses userId internally
  }

  increasequantity(product: Product) {
    this.cartService.updateQuantity(product.id, product.cartQuantity + 1);
    this.loadCart();
  }
  calculateTotal(): number {
    let total = 0;
    for (let item of this.cartItems) {
      const quantity = item.cartQuantity ?? 1;
      total += item.price * quantity;
    }
    this.totalPrice = total;
    return total;
  }

  decreaseQuantity(product: Product) {
    if (product.cartQuantity > 1) {
      this.cartService.updateQuantity(product.id, product.cartQuantity - 1);

      const newQuantity = product.cartQuantity - 1;
      const newTotalPrice = product.price * newQuantity;

      this.cartService.updateTotalPrice(product.id, newTotalPrice);
    } else {
      this.cartService.delete(product.id);
    }

    this.loadCart();
  }
  remove(product: Product) {
    this.cartService.delete(product.id);
    this.loadCart();
  }
  confirmOrder() {
    Swal.fire({
      title: '🛒 Confirm Your Order',
      text: 'Are you sure you want to add a new order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addOrder(this.cartItems);
        Swal.fire({
          title: 'Order Placed!',
          text: 'Your order has been successfully added.',
          icon: 'success',
          confirmButtonColor: '#28a745',
        });
      }
    });
  }

  addOrder(cartItems: any[]) {
    const userId = this.authService.getUserId();
    if (!userId) {
      Swal.fire(
        'Unauthorized',
        'You must be logged in to place an order.',
        'error'
      );
      return;
    }

    const total = this.calculateTotal();

    const orderData = {
      user: { id: userId },
      status: 'Pending',
      total: total,
      products: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        cartQuantity: item.cartQuantity ?? 1,
      })),
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.cartService.clearCart();
        this.router.navigate(['/order']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        Swal.fire('Error', 'Failed to create order.', 'error');
      },
    });
  }
}