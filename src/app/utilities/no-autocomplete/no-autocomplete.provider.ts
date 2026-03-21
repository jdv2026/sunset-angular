import { APP_INITIALIZER, Provider } from '@angular/core';
import { DOCUMENT } from '@angular/common';

function disableAutocomplete(doc: Document): () => void {
	return () => {
		const apply = (node: Element) => {
			if (node.tagName === 'INPUT') node.setAttribute('autocomplete', 'off');
			node.querySelectorAll('input').forEach(el => el.setAttribute('autocomplete', 'off'));
		};

		new MutationObserver(mutations => {
			mutations.forEach(m =>
				m.addedNodes.forEach(node => {
					if (node instanceof Element) apply(node);
				})
			);
		}).observe(doc.body, { childList: true, subtree: true });
	};
}

export function provideNoAutocomplete(): Provider {
	return {
		provide: APP_INITIALIZER,
		useFactory: (doc: Document) => disableAutocomplete(doc),
		deps: [DOCUMENT],
		multi: true,
	};
}
