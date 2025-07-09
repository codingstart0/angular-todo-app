import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

const THEME_KEY = 'theme-preference';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const savedTheme = localStorage.getItem(THEME_KEY);
    this.darkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem(THEME_KEY, this.darkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.darkTheme) {
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
    }
  }
}
