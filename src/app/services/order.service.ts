import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../features/products/product.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  base_url = 'http://localhost:8080/order';
  base_url2 = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) {}
  createOrder(order: any) {
    return this.http.post(`${this.base_url}/save`, order);
  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_url}/get`);
  }
  getOrderById(id: number) {
    return this.http.get(`${this.base_url}/getId/${id}`);
  }
  updateOrder(id: number, order: any) {
    return this.http.put(`${this.base_url}/update/${id}`, order);
  }
  deleteOrder(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  getProductsByOrderId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_url}/products/${id}`);
  }

  sendInvoice(orderId: number, email: string) {
    return this.http.post(
      `${this.base_url2}/send?orderId=${orderId}&email=${email}`,
      {},
      { responseType: 'text' }
    );
  }
  getOrdersByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_url}/user/${userId}`);
  }
}
