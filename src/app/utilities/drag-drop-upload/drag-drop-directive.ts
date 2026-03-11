import {
	Directive,
	HostListener,
	Output,
	EventEmitter
} from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
	file: File,
	url: SafeUrl
}

@Directive({
	selector: "[appDrag]",
	standalone: true
})

export class DragDirective {
	@Output() files = new EventEmitter<FileHandle[]>();
  
	constructor(private sanitizer: DomSanitizer) {}
  
	@HostListener("dragover", ["$event"]) onDragOver(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
	}
  
	@HostListener("dragleave", ["$event"]) onDragLeave(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
	}
  
	@HostListener("drop", ["$event"]) onDrop(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
	
		const files: FileHandle[] = [];
		if (evt.dataTransfer?.files.length) {
			for (let i = 0; i < evt.dataTransfer.files.length; i++) {
				const file = evt.dataTransfer.files[i];
				const url = this.sanitizer.bypassSecurityTrustUrl(
					window.URL.createObjectURL(file)
				);
				files.push({ file, url });
			}
			this.files.emit(files);
		}
	}
  
	// This prevents the open file on tab when dragging not inside circle wekwekwek
	@HostListener("document:dragover", ["$event"])
	@HostListener("document:drop", ["$event"])
	preventDefaults(evt: DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
	}
}
  