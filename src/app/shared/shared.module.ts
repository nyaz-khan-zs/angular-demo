import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [UserFormComponent],
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  exports: [NgSelectModule, ReactiveFormsModule, UserFormComponent],
})
export class SharedModule {}
