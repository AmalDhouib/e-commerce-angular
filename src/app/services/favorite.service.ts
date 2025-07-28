import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  base_url = 'http://localhost:8080/favorite';

  constructor(private http: HttpClient) {}

  createFavorite(favorite: { userId: number; productId: number }) {
    return this.http.post(`${this.base_url}/save`, favorite);
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_url}/get`);
  }

  deleteFavoriteByUserAndProduct(userId: number, productId: number) {
    return this.http.delete(
      `${this.base_url}/deleteByUserAndProduct?userId=${userId}&productId=${productId}`
    );
  }

  checkFavorite(userId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.base_url}/check?userId=${userId}&productId=${productId}`
    );
  }

  getFavoritesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_url}/user/${userId}`);
  }
}
