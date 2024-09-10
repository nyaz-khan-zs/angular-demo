import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobCardComponent } from './job-card/job-card.component';
import { JobFormComponent } from './job-form/job-form.component';
import { NewJobComponent } from './new-job/new-job.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    JobListComponent,
    JobCardComponent,
    JobFormComponent,
    NewJobComponent,
  ],
  imports: [CommonModule, SharedModule, LayoutRoutingModule],
})
export class LayoutModule {}
