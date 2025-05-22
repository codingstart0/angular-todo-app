import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

import { TodoService } from '../../services/todo.service';
import { BlurService } from '../../services/blur.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit, AfterViewChecked {
  @Input() todoFormGroup?: FormGroup;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  idControl?: FormControl<number>;
  titleControl?: FormControl<string>;
  completedControl?: FormControl<boolean>;

  isEditing = false;
  shouldFocus = false;

  @ViewChild('titleInput') titleInput?: ElementRef;

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private blurService: BlurService
  ) {}

  ngOnInit(): void {
    this.idControl = this.todoFormGroup?.get('id') as FormControl;
    this.titleControl = this.todoFormGroup?.get('title') as FormControl;
    this.completedControl = this.todoFormGroup?.get('completed') as FormControl;
  }

  ngAfterViewChecked(): void {
    if (this.isEditing && this.shouldFocus && this.titleInput?.nativeElement) {
      this.shouldFocus = false;
      this.ngZone.run(() => {
        this.titleInput?.nativeElement.select();
        this.titleInput?.nativeElement.focus();
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  onEnterKey(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.saveEdit();
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
      this.shouldFocus = true;
    }
  }

  deleteTodo(): void {
    this.blurService.blurActiveElement();

    if (this.todoFormGroup) {
      this.delete.emit(this.todoFormGroup.get('id')?.value);
    }
  }

  saveEdit(): void {
    if (this.idControl && this.titleControl && this.completedControl) {
      this.todoService
        .updateTodo({
          id: this.idControl.value,
          title: this.titleControl.value,
          completed: this.completedControl.value,
        })
        .subscribe((updateTodo) => {
          this.titleControl?.setValue(updateTodo.title);
          this.isEditing = false;
        });
    }
  }
}
