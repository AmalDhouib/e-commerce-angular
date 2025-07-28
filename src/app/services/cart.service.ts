import { Injectable } from '@angular/core';
import { Product, ProductResponse } from '../features/products/product.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private authService: AuthService) {}

  private getStorageKey(): string {
    const userId = this.authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return `cart_user_${userId}`;
  }

  saveCart(cart: Product[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(cart));
  }

  getCart(): Product[] {
    const cart = localStorage.getItem(this.getStorageKey());
    return cart ? JSON.parse(cart) : [];
  }

  addTocart(product: Product): void {
    const cart = this.getCart();
    const existingProduct = cart.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.cartQuantity += 1;
    } else {
      product.cartQuantity = 1;
      cart.push(product);
    }
    this.saveCart(cart);
  }

  delete(productId: number): void {
    let cart = this.getCart();
    cart = cart.filter((p) => p.id !== productId);
    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.getStorageKey());
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const product = cart.find((p) => p.id === productId);
    if (product) {
      product.cartQuantity = quantity > 0 ? quantity : 1;
      this.saveCart(cart);
    }
  }

  updatePrice(productId: number, price: number): void {
    const cart = this.getCart();
    const product = cart.find((p) => p.id === productId);
    if (product) {
      product.price = price;
      this.saveCart(cart);
    }
  }

  updateTotalPrice(productId: number, totalPrice: number): void {
    const cart = this.getCart();
    const product = cart.find((p) => p.id === productId);
    if (product) {
      product.totalPrice = totalPrice;
      this.saveCart(cart);
    }
  }
}
