import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css'],
  imports: [FormsModule, RouterLink],
})
export class DeliveryInfoComponent implements OnInit {
  fullName = '';
  email = '';
  address = '';
  phone = '';
  latestOrderId: number | null = null;
  productsInOrder: any[] = [];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadLatestOrder();
  }

  loadLatestOrder() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.orderService.getOrderById(+id).subscribe({
        next: (data) => {
          console.log('Order loaded successfully:', data);
          this.latestOrderId = +id;
          this.orderService.getProductsByOrderId(+id).subscribe({
            next: (d) => {
              this.productsInOrder = d;
            },
          });
        },
        error: (err) => {
          console.error('Failed to fetch order', err);
        },
      });
    } else {
      console.error('No order ID provided in the route.');
    }
  }

  submit() {
    if (!this.latestOrderId) {
      alert('No order to update.');
      return;
    }

    const updatedOrder = {
      deliveryFullName: this.fullName,
      deliveryEmail: this.email,
      deliveryAddress: this.address,
      deliveryPhone: this.phone,
      status: 'Confirmed',
    };

    this.orderService.updateOrder(this.latestOrderId, updatedOrder).subscribe({
      next: () => {
        // Après mise à jour, envoyer la facture par mail
        this.orderService
          .sendInvoice(this.latestOrderId!, this.email)
          .subscribe({
            next: () => {
              alert(
                'Commande confirmée et facture envoyée par mail avec succès !'
              );
            },
            error: (err) => {
              console.error('Erreur lors de l’envoi de la facture', err);
              alert(
                'Commande confirmée mais erreur lors de l’envoi de la facture.'
              );
            },
          });
      },
      error: (err) => {
        console.error('Failed to update order', err);
        alert('Error updating the order.');
      },
    });
  }
}