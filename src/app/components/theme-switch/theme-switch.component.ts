import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss'],
})
export class ThemeSwitchComponent {
  constructor(private themeService: ThemeService) {}

  onToggleThemeClick(): void {
    this.themeService.toggleTheme();
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
}
