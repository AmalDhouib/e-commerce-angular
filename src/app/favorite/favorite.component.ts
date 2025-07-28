import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';
import { EmptyStateComponent } from '../shared/empty-state/empty-state.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css',
})
export class FavoriteComponent implements OnInit {
  favorites: any[] = [];

  get error(): string {
    return 'Sorry, there is no product in your favorites. Try discovering our products and choose the best for you!';
  }

  get empty(): boolean {
    return this.favorites.length === 0;
  }

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.warn('Utilisateur non connecté');
      this.favorites = [];
      this.cdr.detectChanges();
      return;
    }

    this.favoriteService.getFavoritesByUser(+userId).subscribe({
      next: (data: any[]) => {
        const productIds: number[] = [];
        this.favorites = data.filter((fav) => {
          if (!productIds.includes(fav.product.id)) {
            productIds.push(fav.product.id);
            return true;
          }
          return false;
        });
        console.log('Favorites:', this.favorites);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement favoris', err),
    });
  }

  removeFavorite(productId: number): void {
    const userId = this.authService.getUserId();
    console.log(
      'Suppression favorite pour userId:',
      userId,
      'productId:',
      productId
    );
    if (!userId) {
      console.warn('Utilisateur non connecté');
      return;
    }
    this.favoriteService
      .deleteFavoriteByUserAndProduct(+userId, productId)
      .subscribe({
        next: () => {
          console.log('Favori supprimé, rechargement...');
          this.loadFavorites();
        },
        error: (err) => console.error('Erreur suppression favori', err),
      });
  }
}  
