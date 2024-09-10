import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { DELAY_TIME } from 'src/app/core/utils/constant';
import { JobDetails } from 'src/app/models/job-details.model';
import { USER_TYPE, User } from 'src/app/models/user.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
})
export class JobCardComponent implements OnChanges {
  @Input() job!: JobDetails;
  @Input() logedInUser!: User;
  isEmployer: boolean = false;
  isAlreadyApplied: boolean = false;
  isAplying: boolean = false;
  constructor(
    private jobService: JobService,
    private toastrService: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isEmployer = this.logedInUser.userType == USER_TYPE.EMPLOYER;
    this.isAlreadyApplied = this.isApplied();
  }
  getFirstLetterColor(companyName: string): string {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF3357'];
    return colors[companyName.charCodeAt(0) % colors.length];
  }

  isApplied(): boolean {
    return this.job.applicantDetails.includes(this.logedInUser.email)
      ? true
      : false;
  }
  applyJob() {
    this.isAplying = true;
    this.jobService
      .applyJob(this.job, this.logedInUser)
      .pipe(delay(DELAY_TIME))
      .subscribe(
        (job: JobDetails) => {
          this.job = job;
          this.isAlreadyApplied = true;
          this.isAplying = false;
          this.toastrService.success('', 'Applied sucessfully');
        },
        (error) => {
          this.isAplying = false;
          this.toastrService.error(error);
        }
      );
  }
}
