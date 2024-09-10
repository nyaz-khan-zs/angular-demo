import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { delay, Subject } from 'rxjs';
import { JobService } from '../../../services/job.service';
import { USER_TYPE, User } from 'src/app/models/user.model';
import { JobDetails } from 'src/app/models/job-details.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DELAY_TIME } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnChanges {
  isEmployer: boolean = false;
  logedInUser!: User;
  jobs: JobDetails[] = [];
  searchForm: FormGroup;
  allFilteredJobs: JobDetails[] = [];
  filteredJobs: JobDetails[] = [];
  skills: string[] = [];
  loading = false;
  isJobLoading = true;
  batchSize = 0;

  private searchSubject = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: '',
      minSalary: null,
      selectedSkills: [],
    });
  }

  ngOnChanges(): void {}
  getJobs() {
    this.jobService
      .getJobs(this.isEmployer ? this.logedInUser.email : '')
      .pipe(delay(DELAY_TIME))
      .subscribe(
        (jobs) => {
          this.isJobLoading = false;
          this.jobs = jobs;
          this.allFilteredJobs = jobs;
          this.loadMoreJobs();
          this.jobService.jobs = jobs;
          this.searchSubject.subscribe(() => this.filterJobs());
          this.searchForm.valueChanges.subscribe(() =>
            this.searchSubject.next()
          );
        },
        (error) => {
          this.isJobLoading = false;
          this.toastrService.error(error);
        }
      );
  }
  ngOnInit(): void {
    this.getLogedInUserDetails();
    this.jobService.getSkillList().subscribe((skills: string[]) => {
      this.skills = skills;
    });
  }

  filterJobs(): void {
    const { searchQuery, minSalary, selectedSkills } = this.searchForm.value;

    this.allFilteredJobs = this.jobs.filter((job) => {
      const matchesTitle =
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobRole.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSalary = minSalary ? job.salary >= minSalary : true;
      const matchesSkills =
        selectedSkills && selectedSkills.length
          ? selectedSkills.every((skill: string) => job.skills.includes(skill))
          : true;

      return matchesTitle && matchesSalary && matchesSkills;
    });
    this.batchSize = 0;
    this.loadMoreJobs();
  }
  loadMoreJobs(): void {
    if (this.loading) return;
    this.loading = true;
    this.batchSize =
      this.allFilteredJobs.length < 20
        ? this.allFilteredJobs.length
        : this.batchSize + 20;
    const nextJobs =
      this.allFilteredJobs.length != 0
        ? this.allFilteredJobs.slice(0, this.batchSize)
        : [];

    setTimeout(() => {
      this.filteredJobs = [...nextJobs];
      this.loading = false;
    }, 500);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight;

    if (scrollPosition > threshold - 10) {
      this.loadMoreJobs();
    }
  }

  getLogedInUserDetails() {
    this.logedInUser = this.userService.getLogedInUser();
    this.isEmployer = this.logedInUser?.userType === USER_TYPE.EMPLOYER;
    this.getJobs();
  }
}
