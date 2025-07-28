import { ExtraOptions, Routes } from '@angular/router';
import { ProductListComponent } from './features/products/list/product-list.component';
import { EditComponent } from './features/products/edit/edit.component';
import { AddComponent } from './features/products/add/add.component';
import { DetailComponent } from './features/products/detail/detail.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { OrderComponent } from './order/order.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [

  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'update-product/:id',
    component: EditComponent,
  },
  { path: 'add', component: AddComponent },
  {
    path: 'detail/:id',
    component: DetailComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  { path: 'favorite', component: FavoriteComponent },
  {
    path: 'order',
    component: OrderComponent,
  },
  { path: 'delivery-info/:id', component: DeliveryInfoComponent },
  { path: 'login', component: LoginComponent },
  {path:'register',component:RegisterComponent}
];
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
}
;