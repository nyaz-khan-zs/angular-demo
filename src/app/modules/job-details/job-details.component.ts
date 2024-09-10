import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { JobDetails } from 'src/app/models/job-details.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { USER_TYPE, User } from 'src/app/models/user.model';
import { delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DELAY_TIME } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  jobDetails!: JobDetails;
  jobId: string | null = null;
  candidateList!: User[];
  isEmployer: boolean = false;
  logedInUser!: User;
  fileContent: string | ArrayBuffer | null = null;
  isAlreadyApplied: boolean = false;
  constructor(
    private jobService: JobService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    const file = localStorage.getItem('file');
    this.fileContent = file ? JSON.parse(file) : null;
  }
  getFirstLetterColor(name: string): string {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF3357'];
    return colors[name.charCodeAt(0) % colors.length];
  }
  isApplied(): boolean {
    return this.jobDetails.applicantDetails.includes(this.logedInUser.email)
      ? true
      : false;
  }
  applyJob() {
    this.jobService
      .applyJob(this.jobDetails, this.logedInUser)
      .pipe(delay(DELAY_TIME))
      .subscribe((job: JobDetails) => {
        this.jobDetails = job;
        this.isAlreadyApplied = true;
        this.toastrService.success('', 'Applied sucessfully');
      });
  }
  getLogedInUserDetails() {
    this.logedInUser = this.userService.getLogedInUser();
    this.isEmployer = this.logedInUser?.userType === USER_TYPE.EMPLOYER;
  }
  ngOnInit() {
    this.getLogedInUserDetails();
    this.route.paramMap.subscribe((params) => {
      this.jobId = params.get('id');
      if (this.jobId) {
        this.jobService
          .getJobById(this.jobId)
          .pipe(delay(DELAY_TIME))
          .subscribe((job: JobDetails) => {
            this.jobDetails = job;
            this.isAlreadyApplied = this.isApplied();
            if (this.isEmployer && job.applicantDetails.length > 0) {
              this.getCandidates(job.applicantDetails);
            } else {
              this.candidateList = [];
            }
          });
      } else {
        console.log('job not found');
      }
    });
  }
  getCandidates(candidateList: string[]) {
    this.userService
      .getUsersByEmails(candidateList)
      .pipe(delay(DELAY_TIME))
      .subscribe((userList: User[]) => {
        console.log(userList);
        this.candidateList = userList;
      });
  }
}
