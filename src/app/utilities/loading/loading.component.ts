import { Component, Inject, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingModalData } from './loading.contracts';

@Component({
	selector: 'vex-loading',
	standalone: true,
	imports: [
		MatProgressSpinnerModule
	],
	templateUrl: './loading.component.html',
	styleUrl: './loading.component.scss'
})

export class LoadingComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: LoadingModalData
	) {}
}
