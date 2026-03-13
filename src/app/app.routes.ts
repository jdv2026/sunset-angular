import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { PublicComponent } from './public/public.component';
import { PrivateComponent } from './private/private.component';
import { authGuard } from './core/auth.guard';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { errorGuard } from './core/error.guard';

export const appRoutes: VexRoutes = [
	{
		path: 'error/:status',
		component: ErrorPageComponent,
		canActivate: [errorGuard]
	},
	{
		path: '',
		component: PublicComponent,
		canActivate: [],
		children: [
			{
				path: '',
				loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent),
			},
		]
	},
	{
		path: 'dashboard',
		component: PrivateComponent,
		canActivate: [authGuard],
		children: [
			{
				path: 'home',
				loadComponent: () => import('./private/home/home.component').then(m => m.HomeComponent)
			},
			{
				path: 'budget/overview',
				loadComponent: () => import('./private/budget/overview/overview.component').then(m => m.OverviewComponent)
			},
			{
				path: 'budget/transactions',
				loadComponent: () => import('./private/budget/transactions/transactions.component').then(m => m.TransactionsComponent)
			},
			{
				path: 'budget/categories',
				loadComponent: () => import('./private/budget/categories/categories.component').then(m => m.CategoriesComponent)
			},
			{
				path: 'budget/reports',
				loadComponent: () => import('./private/budget/reports/reports.component').then(m => m.ReportsComponent)
			},
			{
				path: 'budget/goals',
				loadComponent: () => import('./private/budget/goals/goals.component').then(m => m.GoalsComponent)
			},
			{
				path: 'budget/bills',
				loadComponent: () => import('./private/budget/bills/bills.component').then(m => m.BillsComponent)
			}
		]
	}
];
