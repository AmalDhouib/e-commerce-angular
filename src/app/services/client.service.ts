import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  base_url = 'https://localhost:8080/client';
  constructor(private http: HttpClient) { }
  createClient(client: any) {
    return this.http.post(`${this.base_url}/save`, client);
  }
  getClients() {
    return this.http.get(`${this.base_url}/get`);
  }
  getClientById(id: number) {
    return this.http.get(`${this.base_url}/getId/${id}`);
  }
  updateClient(id: number, client: any) {
    return this.http.put(`${this.base_url}/update/${id}`, client);
  }
  deleteClient(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  create_with_image(categoryId: number, client: any) {
    return this.http.post(`${this.base_url}/createwithimage/${categoryId}`, client);
  }

}
