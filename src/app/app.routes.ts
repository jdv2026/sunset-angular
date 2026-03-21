import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { PublicComponent } from './public/public.component';
import { PrivateComponent } from './private/private.component';
import { authGuard } from './core/auth.guard';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { errorGuard } from './core/error.guard';
import { GuestComponent } from './public/guest/guest.component';

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
		path: 'guest',
		component: GuestComponent,
		children: [
			{
				path: 'home',
				loadComponent: () => import('./public/guest/home/home.component').then(m => m.HomeComponent),
			},
			{
				path: 'profile',
				loadComponent: () => import('./public/guest/profile/profile.component').then(m => m.GuestProfileComponent),
			},
			{
				path: 'budget/overview',
				loadComponent: () => import('./public/guest/budget/overview/overview.component').then(m => m.OverviewComponent),
			},
			{
				path: 'budget/transactions',
				loadComponent: () => import('./public/guest/budget/transactions/transactions.component').then(m => m.TransactionsComponent),
			},
			{
				path: 'budget/categories',
				loadComponent: () => import('./public/guest/budget/categories/categories.component').then(m => m.CategoriesComponent),
			},
			{
				path: 'budget/reports',
				loadComponent: () => import('./public/guest/budget/reports/reports.component').then(m => m.ReportsComponent),
			},
			{
				path: 'budget/goals',
				loadComponent: () => import('./public/guest/budget/goals/goals.component').then(m => m.GoalsComponent),
			},
			{
				path: 'budget/bills',
				loadComponent: () => import('./public/guest/budget/bills/bills.component').then(m => m.BillsComponent),
			},
			{
				path: 'physical/overview',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
			},
			{
				path: 'physical/workouts',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
			},
			{
				path: 'physical/program',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
			},
			{
				path: 'physical/progress-report',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
			},
			{
				path: 'physical/schedule',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
			},
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
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
			},
			{
				path: 'budget/wallets',
				loadComponent: () => import('./private/budget/wallets/wallets.component').then(m => m.WalletsComponent)
			},
			{
				path: 'profile/:id',
				loadComponent: () => import('./private/profile/profile.component').then(m => m.ProfileComponent)
			},
			{
				path: 'physical/overview',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent)
			},
			{
				path: 'physical/workouts',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent)
			},
			{
				path: 'physical/program',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent)
			},
			{
				path: 'physical/progress-report',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent)
			},
			{
				path: 'physical/schedule',
				loadComponent: () => import('./utilities/under-construction/under-construction.component').then(m => m.UnderConstructionComponent)
			}
		]
	}
];
