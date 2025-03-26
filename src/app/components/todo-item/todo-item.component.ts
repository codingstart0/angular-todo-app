import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input() todoFormGroup?: FormGroup;
  @Output() edit = new EventEmitter<void>();
  @Output() deleteTodoEvent = new EventEmitter<number>();

  idControl?: FormControl<number>;
  titleControl?: FormControl<string>;
  completedControl?: FormControl<boolean>;

  isEditing = false;

  @ViewChild('titleInput') titleInput?: ElementRef;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.idControl = this.todoFormGroup?.get('id') as FormControl;
    this.titleControl = this.todoFormGroup?.get('title') as FormControl;
    this.completedControl = this.todoFormGroup?.get('completed') as FormControl;
  }

  AfterViewInit(): void {
    if (this.isEditing && this.titleInput) {
      this.titleInput.nativeElement.select();
    }
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
      setTimeout(() => {
        if (this.titleInput) {
          this.titleInput.nativeElement.select();
        }
      }, 0);
    }
  }

  deleteTodo(): void {
    if (this.idControl) {
      this.todoService.deleteTodo(this.idControl.value).subscribe(() => {
        this.deleteTodoEvent.emit(this.idControl?.value);
      });
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
          this.isEditing = false;
        });
    }
  }
}
