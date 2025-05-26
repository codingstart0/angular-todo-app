import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { TodoService } from '../../services/todo.service';
import { BlurService } from '../../services/blur.service';
import { Todo } from '../../interfaces/todo.interface';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ResetOnSubmitErrorStateMatcher } from '../../utils/reset-on-submit-error-state-matcher';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  newTodoForm: FormGroup;
  todosFormGroup: FormGroup;
  todosFormArray: FormArray<FormGroup>;
  submitted = false;

  matcher = new ResetOnSubmitErrorStateMatcher(() => this.submitted);

  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private blurService: BlurService
  ) {
    this.newTodoForm = this.createNewTodoForm();
    this.submitted = false;

    this.todosFormGroup = new FormGroup({
      todos: new FormArray([]),
    });
    this.todosFormArray = this.todosFormGroup.get('todos') as FormArray;
  }

  ngOnInit(): void {
    console.log(environment.apiBaseUrl);
    this.todoService.getTodos().subscribe((todos) => {
      this.buildTodosForm(todos);
    });
  }

  private createNewTodoForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  private openConfirmDialog(message: string) {
    return this.dialog
      .open(ConfirmDialogComponent, {
        width: '300px',
        data: { message },
        autoFocus: false,
      })
      .afterClosed();
  }

  buildTodosForm(todos: Todo[]) {
    this.todosFormArray.clear();

    todos.forEach((todo) => {
      this.addTodoToFormArray(todo);
    });
  }

  addTodoToFormArray(todo: Todo) {
    this.todosFormArray.push(
      new FormGroup({
        id: new FormControl(todo.id),
        title: new FormControl(todo.title),
        completed: new FormControl(todo.completed),
      })
    );
  }

  addTodo(): void {
    this.submitted = true;

    const titleControl = this.newTodoForm.get('title');

    if (!titleControl || this.newTodoForm.invalid) {
      titleControl?.markAsTouched();

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: this.newTodoForm.value.title,
      completed: false,
    };

    this.todoService.addTodo(newTodo).subscribe((savedTodo) => {
      this.addTodoToFormArray(savedTodo);
      this.newTodoForm.reset({ title: '' });
      console.log({
        value: titleControl?.value,
        pristine: titleControl?.pristine,
        touched: titleControl?.touched,
        dirty: titleControl?.dirty,
        status: titleControl?.status,
      });

      titleControl?.markAsPristine();
      titleControl?.markAsUntouched();
      titleControl?.updateValueAndValidity();
      this.submitted = false;
      this.cdr.detectChanges();
    });
  }

  removeTodoFromFormArray(id: number): void {
    const index = this.todosFormArray.controls.findIndex(
      (todoFormGroup) => todoFormGroup.get('id')?.value === id
    );

    if (index !== -1) {
      this.todosFormArray.removeAt(index);
    }
  }

  onDeleteTodo(id: number): void {
    this.openConfirmDialog(
      'Are you sure you want to delete this todo?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.todoService.removeTodo(id).subscribe(() => {
          this.removeTodoFromFormArray(id);
        });
      }
    });
  }

  deleteAllCompleted(): void {
    this.blurService.blurActiveElement();

    this.openConfirmDialog(
      'Are you sure you want to delete all completed todos?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        const completedTodos = this.todosFormArray.controls.filter(
          (todoFormGroup) => todoFormGroup.get('completed')?.value === true
        );

        completedTodos.forEach((todoFormGroup) => {
          const id = todoFormGroup.get('id')?.value;
          if (id !== undefined) {
            this.todoService.removeTodo(id).subscribe(() => {
              this.removeTodoFromFormArray(id);
            });
          }
        });
      }
    });
  }

  hasCompletedTodos(): boolean {
    return this.todosFormArray.controls.some(
      (todoFormGroup) => todoFormGroup.get('completed')?.value === true
    );
  }

  showTitleError(): boolean {
    const control = this.newTodoForm.get('title');

    return !!control && control.invalid && (control.touched || this.submitted);
  }

  trackById(index: number, group: FormGroup): number {
    return group.get('id')?.value;
  }
}
