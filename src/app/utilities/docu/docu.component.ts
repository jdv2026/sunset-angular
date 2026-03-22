import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'vex-docu',
	standalone: true,
	imports: [CommonModule, RouterLink, MatIconModule],
	templateUrl: './docu.component.html',
	styleUrl: './docu.component.scss',
})
export class DocuComponent {}
