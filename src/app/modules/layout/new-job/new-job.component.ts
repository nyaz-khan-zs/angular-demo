import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { DELAY_TIME } from 'src/app/core/utils/constant';
import { JobDetails } from 'src/app/models/job-details.model';
import { User, USER_TYPE } from 'src/app/models/user.model';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss'],
})
export class NewJobComponent implements OnInit {
  jobDetails!: JobDetails;
  jobId: string | null = null;
  candidateList: User[] = [];
  isEmployer: boolean = false;
  logedInUser!: User;
  constructor(
    private jobService: JobService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}
  ngOnInit() {
    this.getLogedInUserDetails();
    this.route.paramMap.subscribe((params) => {
      this.jobId = params.get('jobId');
      if (this.jobId) {
        this.jobService
          .getJobById(this.jobId)
          .pipe(delay(DELAY_TIME))
          .subscribe(
            (job: JobDetails) => {
              this.jobDetails = job;
            },
            (error) => {
              this.router.navigate(['/jobs']);
              this.toastrService.error(error);
            }
          );
      }
    });
  }
  getLogedInUserDetails() {
    this.logedInUser = this.userService.getLogedInUser();
    this.isEmployer = this.logedInUser?.userType === USER_TYPE.EMPLOYER;
  }
}
