import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Catalog } from './pages/catalog/catalog';
import { ManageCatalog } from './pages/manage-catalog/manage-catalog';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogo', component: Catalog },
  { path: 'gestion', component: ManageCatalog },
  { path: 'contacto', component: Contact },
  { path: '**', redirectTo: '' }
];
