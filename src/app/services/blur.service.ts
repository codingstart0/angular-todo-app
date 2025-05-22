import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlurService {
  blurActiveElement(): void {
    requestAnimationFrame(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
}
