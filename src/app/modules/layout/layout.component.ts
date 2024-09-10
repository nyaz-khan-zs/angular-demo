import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  logedInUser!: User;

  constructor(private userService: UserService) {
    this.getLogedInUserDetails();
  }
  getLogedInUserDetails() {
    this.logedInUser = this.userService.getLogedInUser();
  }
}
