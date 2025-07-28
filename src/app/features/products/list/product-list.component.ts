import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category, Product, ProductRequest, ProductResponse } from '../product.model';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { CategoryService } from '../../../services/category.service';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { FavoriteService } from '../../../services/favorite.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, EmptyStateComponent],
})
export class ProductListComponent implements OnInit {
  favorites: any[] = [];
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  isAdmin = false;
  productCategoryNames: { [key: number]: string } = {};
  categories: Category[] = [];
  categorySuggestions: string[] = [];
  filterCategory: string = '';
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  allProducts: Product[] = [];
  selectedProduct: any = null;
  showModal: boolean = false;
  constructor(
    private productService: ProductsService,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadfavorite();
    this.loadAllCategories();
    this.loadFavoritesAndProducts();
  }
  loadfavorite(): void {
    const userStr = localStorage.getItem('user');
    const userId = userStr ? Number(JSON.parse(userStr).id) : null;

    if (!userId || isNaN(userId)) {
      console.warn('Utilisateur non connecté');
      this.loadProducts();
      return;
    }

    this.favoriteService.getFavoritesByUser(userId).subscribe({
      next: (data) => {
        this.favorites = data;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erreur chargement favoris', err);
        this.loadProducts();
      },
    });
  }
  toggleFavorite(product: Product): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Utilisateur non connecté ou ID invalide');
      return;
    }

    this.favoriteService.checkFavorite(+userId, product.id).subscribe({
      next: (isFav) => {
        if (isFav) {
          this.favoriteService
            .deleteFavoriteByUserAndProduct(+userId, product.id)
            .subscribe({
              next: () => {
                product.favorite = false;
                this.favorites = this.favorites.filter(
                  (f) => f.product.id !== product.id
                );
              },
              error: (err) => console.error('Erreur suppression favori', err),
            });
        } else {
          this.favoriteService
            .createFavorite({ userId: +userId, productId: product.id })
            .subscribe({
              next: () => {
                product.favorite = true;
                this.favorites.push({ product }); // simplifié
              },
              error: (err) => console.error('Erreur ajout favori', err),
            });
        }
      },
      error: (err) => console.error('Erreur vérification favori', err),
    });
  }

  loadAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('categories non trouvées', err);
        this.error = 'categories non trouvées.';
      },
    });
  }
  openProductModal(product: any) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeProductModal() {
    this.showModal = false;
  }

  selectCategorySuggestion(categoryName: string) {
    this.filterCategory = categoryName;
    this.categorySuggestions = [];
    this.SearchByCategory(categoryName);
  }
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products: any) => {
        this.allProducts = products;

        console.log('Produits chargés :', products);
        this.products = products;
        this.loading = false;

        for (let produit of this.products) {
          console.log('Produit:', produit);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits :', err);
        this.error = 'Erreur de chargement';
        this.loading = false;
      },
    });
  }
  filterProducts(): void {
    if (!this.searchTerm) {
      this.products = this.allProducts;
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.products = this.allProducts.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        console.log('produit effacé avec succès');
        this.loadProducts();
      },
      error: (err) => {
        console.error('produit n`existe pas :', err);
      },
    });
  }

  SearchByCategory(name: string): void {
    this.productService.getProductBycategory(name).subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.error = null;
      },
      error: (err) => {
        console.error('produit introuvable:', err);
        this.error = 'Aucun produit trouvé pour cette catégorie';
        this.products = [];
      },
    });
  }
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.onCategorySelect(selectedValue);
  }

  onCategorySelect(categoryName: string): void {
    if (!categoryName) {
      this.loadProducts();
    } else {
      this.SearchByCategory(categoryName);
    }
  }

  changePage(delta: number): void {
    const newPage = this.page + delta;
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadProducts();
    }
  }
  loadFavoritesAndProducts(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.favoriteService.getFavoritesByUser(+userId).subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erreur chargement favoris', err);
        this.loadProducts(); // continue quand même
      },
    });
  }
}


