import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css',
})
export class AddComponent implements OnInit {
  productform!: FormGroup;
  imagePreviewUrl: string | null = null;
  newCategoryName: string = '';
  categories: any[] = [];

  constructor(
    private productservice: ProductsService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.productform = this.fb.group({
      name: ['', Validators.required],
      price: [null, Validators.required],
      description: ['', Validators.required],
      stockQuantity: [null, Validators.required],
      material: ['', Validators.required],
      technique: ['', Validators.required],
      image: [null, Validators.required],
      originCountry: ['', Validators.required],
      ecoFriendly: [false],
      limitedEdition: [false],
      productionTime: ['', Validators.required],
      category: [''],
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  onSubmit() {
    const productData = this.productform.value;
    const trimmedNewCategory = this.newCategoryName.trim();

    // Si le formulaire est invalide OU image absente
    if (this.productform.invalid || !this.productform.get('image')?.value) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields including the image.',
      });
      return;
    }

    // Si aucune catégorie n’est choisie ou saisie
    if (!productData.category && !trimmedNewCategory) {
      Swal.fire({
        icon: 'error',
        title: 'Category Missing',
        text: 'Please select an existing category or add a new one.',
      });
      return;
    }

    // Si nouvelle catégorie à créer
    if (!productData.category && trimmedNewCategory) {
      this.categoryService
        .createCategory({ name: trimmedNewCategory })
        .subscribe({
          next: (createdCat: any) => {
            productData.category = createdCat.id;
            this.newCategoryName = '';
            this.continueSubmit(productData);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Category Error',
              text: 'Failed to create the new category.',
            });
          },
        });
    } else {
      this.continueSubmit(productData);
    }
  }

  continueSubmit(productData: any) {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price?.toString() ?? '0');
    formData.append('description', productData.description);
    formData.append(
      'stockQuantity',
      (productData.stockQuantity ?? 0).toString()
    );
    formData.append('material', productData.material);
    formData.append('technique', productData.technique);
    formData.append('originCountry', productData.originCountry);
    formData.append('ecoFriendly', productData.ecoFriendly ? 'true' : 'false');
    formData.append(
      'limitedEdition',
      productData.limitedEdition ? 'true' : 'false'
    );
    formData.append('productionTime', productData.productionTime);
    formData.append('category.id', productData.category.toString());

    const image = this.productform.get('image')?.value;
    if (image instanceof File) {
      formData.append('file', image);
    }

    this.productservice
      .create_with_image(productData.category, formData)
      .subscribe({
        next: () => {
          this.productform.reset();
          this.imagePreviewUrl = null;
          Swal.fire({
            icon: 'success',
            title: 'Congratulations!',
            text: 'Your product was saved successfully.',
          });
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout du produit', error);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'There was a problem saving your product.',
          });
        },
      });
  }

  onFilechange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.productform.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addCategory() {
    const trimmedName = this.newCategoryName.trim();
    if (!trimmedName) return;

    const newCategory = { name: trimmedName };
    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.categoryService.getCategories().subscribe((data) => {
          this.categories = data;
          const added = this.categories.find((c) => c.name === trimmedName);
          if (added) {
            this.productform.patchValue({ category: added.id });
          }
          this.newCategoryName = '';
        });
      },
      error: (err) => {
        console.error('Erreur création catégorie :', err);
        alert("Erreur lors de l'ajout de la catégorie.");
      },
    });
  }
}
