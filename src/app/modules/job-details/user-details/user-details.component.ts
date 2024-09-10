import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { DELAY_TIME } from 'src/app/core/utils/constant';
import { JobDetails } from 'src/app/models/job-details.model';
import { User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userDetails!: User;
  userId: string | null = null;
  jobId: string | null = null;
  isUserLoading: boolean = true;
  githubRepoList!: any[];
  constructor(
    private githubService: GithubService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.jobId = params.get('id');
      if (this.userId) {
        this.userService
          .getUsersByEmails([this.userId])
          .pipe(delay(DELAY_TIME))
          .subscribe(
            (user: User[]) => {
              this.userDetails = user[0];
              this.isUserLoading = false;
              this.getGithubRepo(this.userDetails.githubUsername);
            },
            (error) => {
              this.toastrService.error(error);
              this.isUserLoading = false;
            }
          );
      } else {
        console.log('user not found');
      }
    });
  }
  getGithubRepo(userName: string) {
    this.githubService
      .getUserRepos(userName)
      .pipe(delay(DELAY_TIME))
      .subscribe(
        (repo) => {
          this.githubRepoList = repo;
        },
        (error) => {
          this.toastrService.error(error);
        }
      );
  }
  getFirstLetterColor(name: string): string {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF3357'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
