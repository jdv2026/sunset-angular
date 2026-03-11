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
		
		]
	}
];
