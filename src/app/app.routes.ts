import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'form',
        loadComponent: () =>
            import('./components/form/form.component').then(m => m.FormComponent)
    },
    {
        path: 'form/:id',
        loadComponent: () =>
            import('./components/form/form.component').then(m => m.FormComponent)
    }
]; 