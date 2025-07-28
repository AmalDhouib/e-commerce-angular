import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  base_url = 'https://localhost:8080/user';

  constructor(private http: HttpClient) { }
  createUser(user: any) {
    return this.http.post(`${this.base_url}/save`, user);
  }
  getUsers() {
    return this.http.get(`${this.base_url}/get`);
  }
  getUserById(id: number) {
    return this.http.get(`${this.base_url}/getId/${id}`);
  }

  updateUser(id: number, user: any) {
    return this.http.put(`${this.base_url}/put/${id}`, user);
  }
  deleteUser(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  
}
