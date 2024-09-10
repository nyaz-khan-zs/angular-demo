import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDetailsRoutingModule } from './job-details-routing.module';
import { JobDetailsComponent } from './job-details.component';
import { UserCardComponent } from './user-card/user-card.component';
import { UserDetailsComponent } from './user-details/user-details.component';


@NgModule({
  declarations: [
    JobDetailsComponent,
    UserCardComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    JobDetailsRoutingModule
  ]
})
export class JobDetailsModule { }
