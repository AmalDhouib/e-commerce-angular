import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  
} from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  Id!: number;
  productform!: FormGroup;
  categories: any[] = [];
  currentCategoryId!: number;
  imagePreviewUrl: string | null = null;
  showSuccessPopup = false;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.Id = this.route.snapshot.params['id'];
    this.initForm();
    this.loadProductDetails();
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadProductDetails();
      },
    });
  }

  initForm() {
    this.productform = this.fb.group({
      name: [''],
      price: [null],
      description: [''],
      stock: [null],
      material: [''],
      technique: [''],
      image: [null],
      originCountry: [''],
      ecoFriendly: [false],
      limitedEdition: [false],
      productionTime: [''],
      category: [null],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.productform.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  loadProductDetails(): void {
    this.productService.getProductById(this.Id).subscribe({
      next: (product: any) => {
        this.currentCategoryId = +product.category?.id;
        this.imagePreviewUrl =
          'http://localhost:8080/upload/files/' + product.image;

        this.productform.patchValue({
          name: product.name || '',
          price: product.price || null,
          description: product.description || '',
          stock: product.stockQuantity || null,
          material: product.material || '',
          technique: product.technique || '',
          originCountry: product.originCountry || '',
          ecoFriendly: product.ecoFriendly || false,
          limitedEdition: product.limitedEdition || false,
          productionTime: product.productionTime || '',
          category: this.currentCategoryId || null,
          image: null,
        });
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }

  OnSubmit() {
    const updatedProduct = this.productform.value;

    const formData = new FormData();

    formData.append('name', updatedProduct.name);
    formData.append('price', updatedProduct.price);
    formData.append('description', updatedProduct.description);
    formData.append('stockQuantity', updatedProduct.stock);
    formData.append('material', updatedProduct.material);
    formData.append('technique', updatedProduct.technique);
    formData.append('originCountry', updatedProduct.originCountry);
    formData.append('ecoFriendly', updatedProduct.ecoFriendly);
    formData.append('limitedEdition', updatedProduct.limitedEdition);
    formData.append('productionTime', updatedProduct.productionTime);

    const categoryId = updatedProduct.category || this.currentCategoryId;
    formData.append('category.id', categoryId);

    const imageFile = this.productform.get('image')?.value;
    if (imageFile instanceof File) {
      formData.append('file', imageFile);
    }

    this.productService.updateProduct(this.Id, formData).subscribe({
      next: () => {
        console.log('Produit mis à jour avec succès !');
        console.log('FormData:', formData);
        this.showSuccessPopup = true; 
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
      },
    });
  }

  getCategory() {
    this.categoryService.getCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des catégories:', err);
      },
    });
  }
}
