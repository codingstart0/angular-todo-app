import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  NgZone,
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
  shouldFocus = false;

  @ViewChild('titleInput') titleInput?: ElementRef;

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.idControl = this.todoFormGroup?.get('id') as FormControl;
    this.titleControl = this.todoFormGroup?.get('title') as FormControl;
    this.completedControl = this.todoFormGroup?.get('completed') as FormControl;
  }

  ngAfterViewInit(): void {
    if (this.isEditing && this.titleInput?.nativeElement) {
      this.ngZone.run(() => {
        this.titleInput?.nativeElement.select();
        this.titleInput?.nativeElement.focus();
      });
    }
  }

  toggleTodo(): void {
    if (this.idControl && this.completedControl) {
      this.todoService
        .updateTodo({
          id: this.idControl.value,
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
      this.shouldFocus = true;
    }
  }

  deleteTodo(): void {
    if (this.idControl) {
      this.todoService.removeTodo(this.idControl.value).subscribe(() => {
        console.log('Emitting delete event for ID:', this.idControl?.value);
        this.deleteTodoEvent.emit(this.idControl?.value);
      });
    }
  }

  saveEdit(): void {
    if (this.idControl && this.titleControl) {
      console.log(
        '[saveEdit] ID:',
        this.idControl.value,
        'New title:',
        this.titleControl.value,
      );

      this.todoService
        .updateTodo({
          id: this.idControl.value,
          title: this.titleControl.value,
        })
        .subscribe((updateTodo) => {
          console.log('[saveEdit] Updated Todo:', updateTodo);
          this.titleControl?.setValue(updateTodo.title);
          this.isEditing = false;
        });
    }
  }
}
