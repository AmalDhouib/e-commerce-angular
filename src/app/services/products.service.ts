import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../features/products/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  base_url = 'http://localhost:8080/product';
  constructor(private http: HttpClient) {}
  createProduct(product: any) {
    return this.http.post(`${this.base_url}/save`, product);
  }
  getProducts() {
    return this.http.get(`${this.base_url}/get`);
  }

  getProductById(id: number) {
    return this.http.get(`${this.base_url}/getId/${id}`);
  }

  updateProduct(id: number, formData: FormData) {
    return this.http.put(
      `http://localhost:8080/product/update/${id}`,
      formData
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  create_with_image(categoryId: number, product: any) {
    return this.http.post(
      `${this.base_url}/createwithimage/${categoryId}`,
      product
    );
  }
  getProductBycategory(name: string): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(
      `${this.base_url}/findctegory/${name}`
    );
  }

  addProductWithImage(categoryId: number, productData: any, imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);
    for (const key in productData) {
      if (productData.hasOwnProperty(key)) {
        formData.append(key, productData[key]);
      }
    }
    return this.http.post(
      `${this.base_url}/createwithimage/${categoryId}`,
      formData
    );
  }
}