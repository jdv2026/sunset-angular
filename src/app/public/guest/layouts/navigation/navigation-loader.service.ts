import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem, NavigationSubheading } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class NavigationLoaderService {
	private readonly _items: BehaviorSubject<NavigationItem[]> =
		new BehaviorSubject<NavigationItem[]>([]);

	get items$(): Observable<NavigationItem[]> {
		return this._items.asObservable();
	}

	constructor(private readonly layoutService: VexLayoutService) {
	}

	loadNavigation(nav: NavigationItem[]): void {
		this._items.next(nav);
	}

}
