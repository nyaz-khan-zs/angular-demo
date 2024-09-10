import { Component } from '@angular/core';
import { JsonDbService } from './services/json-db.service';
import { JobDetails } from './models/job-details.model';
import { User } from './models/user.model';
import { delay, forkJoin } from 'rxjs';
import { FILE_PATH } from './core/utils/constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Intuit job Potal';

  constructor(private jsonDbService: JsonDbService) {
    this.loadJsonFromLocal();
  }

  loadJsonFromLocal() {
    forkJoin([
      this.jsonDbService.loadJson(FILE_PATH.JOBS),
      this.jsonDbService.loadJson(FILE_PATH.USERS),
      this.jsonDbService.loadJson(FILE_PATH.SKILLS),
    ]).subscribe(([jobs, users, skills]) => {
      localStorage.setItem('jobs', JSON.stringify(jobs));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('skills', JSON.stringify(skills));
    });
  }
}
