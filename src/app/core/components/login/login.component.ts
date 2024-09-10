import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { USER_TYPE } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { DELAY_TIME } from '../../utils/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userTypes: string[] = [USER_TYPE.EMPLOYER, USER_TYPE.FREELANCER];
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router
  ) {
    if (this.checkLoginStatus()) {
      this.router.navigate(['jobs']);
    }
    this.loginForm = this.fb.group({
      email: ['janesmith@example.com', [Validators.required, Validators.email]],
      password: [
        'janesmith@123',
        [Validators.required, Validators.minLength(6)],
      ],
      userType: ['', Validators.required],
    });
  }
  private checkLoginStatus(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }
  ngOnInit(): void {}

  getControl(name: string): AbstractControl | null {
    return this.loginForm.get(name);
  }

  getError(controlName: string, errorName: string): boolean {
    const control = this.getControl(controlName);
    return control?.invalid && control?.touched && control?.errors?.[errorName];
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.userService
        .login(this.loginForm.value)
        .pipe(delay(DELAY_TIME))
        .subscribe((response) => {
          this.isLoading = false;

          if (response) {
            this.toastr.success('', 'login sucsessfully!');
            this.router.navigate(['jobs']);
          } else {
            this.toastr.error('Try Again', 'login failed');
          }
        });
    } else {
      this.toastr.error('', 'Form is invalid');
      this.isLoading = false;
    }
  }
}
