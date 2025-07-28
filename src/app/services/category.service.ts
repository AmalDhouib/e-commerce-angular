import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../features/products/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  base_url = 'http://localhost:8080/category';
  constructor(private http: HttpClient) {}
  createCategory(category: any) {
    return this.http.post(`${this.base_url}/save`, category);
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base_url}/get`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`http://localhost:8080/getId/${id}`);
  }

  updateCategory(id: number, category: any) {
    return this.http.put(`${this.base_url}/update/${id}`, category);
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  
}
