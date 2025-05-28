#TODO

1. let's make add new todo not a simple text input, but multiline textarea as wll.

src/app/components/todo-item/todo-item.component.html
appearance="outline"
class="todo-edit-field" >
<textarea

# TODO extra

1. Modify default theming: https://v15.material.angular.dev/guide/theming
   Setup custom colors for primary (blue shades) and accent (orange shages) colors.

2. Extract common values, like gap, gap-sm, gap-lg, gap-xl, gap-xs and etc into a separate scss file which uses CSS variables (tokens), and usage in here would be: gap: var(--gap);, extract prop values like, sizes, font sizes, font family, gaps, spaces, colors.

# AngularTodoApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
