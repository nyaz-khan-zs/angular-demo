import { Injectable } from '@angular/core';
import { Observable, map, of, throwError } from 'rxjs';
import { JobDetails } from '../models/job-details.model';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import { API_ENDPOINT, SERVER, SERVER_TYPE } from '../core/utils/constant';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  jobs: JobDetails[] = [];
  skills: string[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private readonly http: HttpClient
  ) {
    this.jobs = this.localStorageService.getData('jobs');
    this.skills = this.localStorageService.getData('skills');
  }

  private _mockSaveJob(job: JobDetails): Observable<JobDetails> {
    var last = this.jobs.length;
    job.id = '' + last + 1;
    this.jobs.push(...this.jobs, job);
    return of(job);
  }
  public saveJob(job: JobDetails) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.JOBS}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockSaveJob(job);
    }
    const request$ = this.http.post<JobDetails>(url, job).pipe(
      map((job: JobDetails) => {
        return job;
      })
    );
    return request$;
  }
  public _mockApplyJob(
    job: JobDetails,
    freelancer: User
  ): Observable<JobDetails> {
    const index = this.jobs.findIndex((item) => item.id == job.id);
    if (index !== -1) {
      if (this.jobs[index].applicantDetails.includes(freelancer.email)) {
        return throwError(() => new Error('Job already applied'));
      }
      this.jobs[index] = {
        ...this.jobs[index],
        applicantDetails: this.jobs[index].applicantDetails.concat([
          freelancer.email,
        ]),
      };
      return of(this.jobs[index]);
    } else {
      return throwError(() => new Error('Job not found'));
    }
  }
  public applyJob(job: JobDetails, freelancer: User) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.JOBS}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockApplyJob(job, freelancer);
    }
    const request$ = this.http.post<JobDetails>(url, job).pipe(
      map((job: JobDetails) => {
        return job;
      })
    );
    return request$;
  }

  public _mockUpdateJob(job: JobDetails, user: User): Observable<JobDetails> {
    if (job.email === user.email) {
      const index = this.jobs.findIndex((item) => item.id == job.id);
      if (index !== -1) {
        this.jobs[index] = { ...this.jobs[index], ...job };
        return of(this.jobs[index]);
      } else {
        return throwError(() => new Error('Job not found'));
      }
    } else {
      return throwError(
        () => new Error('Jon can only be updated by the owner')
      );
    }
  }

  public updateJob(job: JobDetails, user: User) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.JOBS}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockUpdateJob(job, user);
    }
    const request$ = this.http.post<JobDetails>(url, job).pipe(
      map((job: JobDetails) => {
        return job;
      })
    );
    return request$;
  }
  private _mockGetJobById(jobId: string): Observable<JobDetails> {
    const job = this.jobs.find((item) => item.id == jobId);
    if (!job) {
      return throwError(() => new Error("Job Dosen't exist"));
    } else {
      return of(job);
    }
  }
  public _mockGetJobs(email?: string): Observable<JobDetails[]> {
    if (this.jobs && this.jobs.length > 0) {
      if (email) {
        return of(this.jobs.filter((job: JobDetails) => job.email === email));
      } else {
        return of(this.jobs);
      }
    } else {
      return throwError(() => new Error('Job not loaded'));
    }
  }
  public getJobById(jobId: string) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.JOBS}/${jobId}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockGetJobById(jobId);
    }
    const request$ = this.http.get<JobDetails>(url).pipe(
      map((job: JobDetails) => {
        return job;
      })
    );
    return request$;
  }

  public getJobs(email?: string) {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.JOBS}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return this._mockGetJobs(email);
    }
    const request$ = this.http.get<JobDetails[]>(url).pipe(
      map((job: JobDetails[]) => {
        return job;
      })
    );
    return request$;
  }

  getSkillList(): Observable<string[]> {
    const url = `${API_ENDPOINT.BASE_URL}${API_ENDPOINT.SKILL}}`;
    if (SERVER === SERVER_TYPE.MOCK) {
      return of(this.skills);
    }
    const request$ = this.http.get<string[]>(url).pipe(
      map((skills: string[]) => {
        return skills;
      })
    );
    return request$;
  }
}
