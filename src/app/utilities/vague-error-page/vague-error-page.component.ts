import { Component, Input } from '@angular/core';

@Component({
	selector: 'vex-vague-error-page',
	standalone: true,
	imports: [],
	templateUrl: './vague-error-page.component.html',
	styleUrl: './vague-error-page.component.scss'
})

export class VagueErrorPageComponent {
	@Input() title: string = 'Oops!';
	@Input() message: string = 'Something went wrong. Please try again later.';
}
