import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input() todoFormGroup?: FormGroup;
  @Output() edit = new EventEmitter<void>();

  idControl?: FormControl<number>;
  titleControl?: FormControl<string>;
  completedControl?: FormControl<boolean>;

  isEditing = false;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.idControl = this.todoFormGroup?.get('id') as FormControl;
    this.titleControl = this.todoFormGroup?.get('title') as FormControl;
    this.completedControl = this.todoFormGroup?.get('completed') as FormControl;
  }
  toggleTodo(): void {
    if (this.idControl && this.titleControl && this.completedControl) {
      this.todoService
        .updateTodo({
          id: this.idControl.value,
          title: this.titleControl.value,
          completed: this.completedControl.value,
        })
        .subscribe((updateTodo) => {
          this.completedControl?.setValue(updateTodo.completed);
        });
    }
  }

  editTodo(): void {
    if (!this.isEditing) {
      this.isEditing = true;
    }
  }
  

  saveEdit(): void {
    if (this.idControl && this.titleControl) {
      this.todoService
        .updateTodo({
          id: this.idControl.value,
          title: this.titleControl.value,
          completed: this.completedControl?.value ?? false,
        })
        .subscribe((updateTodo) => {
          this.titleControl?.setValue(updateTodo.title);
        });
    }
  }
}
