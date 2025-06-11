import { Injectable } from '@angular/core';

const THEME_KEY = 'theme-preference';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme = false;

  constructor() {
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
    const themeClass = this.darkTheme ? 'dark-theme' : 'light-theme';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(themeClass);
  }
}
