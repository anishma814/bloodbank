import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { DonorDashboard } from './donor/donor-dashboard/donor-dashboard';
import { ReceiverDashboard } from './receiver/receiver-dashboard/receiver-dashboard';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'donor-dashboard', component: DonorDashboard, canActivate: [authGuard] },
  { path: 'receiver-dashboard', component: ReceiverDashboard, canActivate: [authGuard] },
];
