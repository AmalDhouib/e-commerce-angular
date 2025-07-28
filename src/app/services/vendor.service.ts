import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  base_url = 'https://localhost:8080/vendor';
  constructor(private http:HttpClient) { }
  createVendor(vendor: any) {
    return this.http.post(`${this.base_url}/save`, vendor);
  }
  getVendors() {
    return this.http.get(`${this.base_url}/get`);
  }
  getVendorById(id: number) {
    return this.http.get(`${this.base_url}/getId/${id}`);
  }
  updateVendor(id: number, vendor: any) {
    return this.http.put(`${this.base_url}/update/${id}`, vendor);
  }
  deleteVendor(id: number) {
    return this.http.delete(`${this.base_url}/delete/${id}`);
  }
  create_with_image(categoryId: number, vendor: any) {
    return this.http.post(`${this.base_url}/createwithimage/${categoryId}`, vendor);
  }
}
