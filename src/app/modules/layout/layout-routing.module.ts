import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { JobListComponent } from 'src/app/modules/layout/job-list/job-list.component';
import { NewJobComponent } from './new-job/new-job.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: JobListComponent,
      },
      {
        path: 'edit/:jobId',
        component: NewJobComponent,
      },
      {
        path: 'new',
        component: NewJobComponent,
      },
      {
        path: ':id',
        loadChildren: () =>
          import('../job-details/job-details.module').then(
            (m) => m.JobDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
