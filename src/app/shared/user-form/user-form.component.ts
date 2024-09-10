import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { DELAY_TIME } from 'src/app/core/utils/constant';
import { USER_TYPE, User } from 'src/app/models/user.model';
import { GithubService } from 'src/app/services/github.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() userDetails?: User;
  @Input() isEdit: boolean = false;
  isLoading: boolean = false;
  signupForm!: FormGroup;
  skills: string[] = [];
  USER_TYPE = USER_TYPE;
  isValidGithubUsername: boolean = false;
  userTypes: string[] = [USER_TYPE.EMPLOYER, USER_TYPE.FREELANCER];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private jobService: JobService,
    private githubService: GithubService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.jobService.getSkillList().subscribe((skills: string[]) => {
      this.skills = skills;
    });
    this.signupForm.get('userType')?.valueChanges.subscribe((value) => {
      this.updateFormFields(value);
    });
    if (this.isEdit) {
      this.signupForm.get('userType')?.disable();
      this.signupForm.get('email')?.disable();
    }
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group(
      {
        id: [this.userDetails?.id || ''],
        userType: [this.userDetails?.userType || '', Validators.required],
        name: [this.userDetails?.name || '', Validators.required],
        email: [
          this.userDetails?.email || '',
          [Validators.required, Validators.email],
        ],
        password: [
          this.userDetails?.password || '',
          [Validators.required, Validators.minLength(6)],
        ],
        confirmPassword: [
          this.userDetails?.confirmPassword || '',
          Validators.required,
        ],
        skills: [this.userDetails?.skills || [], Validators.required],
        githubUsername: [
          this.userDetails?.githubUsername || '',
          Validators.required,
        ],
        companyName: [this.userDetails?.companyName || '', Validators.required],
      },
      {
        validators: this.passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  getControl(name: string): AbstractControl | null {
    return this.signupForm.get(name);
  }

  getError(controlName: string, errorName: string): boolean {
    const control = this.getControl(controlName);
    return control?.invalid && control?.touched && control?.errors?.[errorName];
  }

  private passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.get(password);
      const confirmPass = formGroup.get(confirmPassword);

      if (confirmPass?.errors && !confirmPass.errors['passwordMismatch']) {
        return;
      }

      if (pass?.value !== confirmPass?.value) {
        confirmPass?.setErrors({ passwordMismatch: true });
      } else {
        confirmPass?.setErrors(null);
      }
    };
  }

  addSkill(newSkill: string): void {
    if (newSkill && !this.skills.includes(newSkill)) {
      this.skills.push(newSkill);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.signupForm.valid) {
      if (this.signupForm.value.userType === USER_TYPE.FREELANCER) {
        this.checkGithubUserName(this.signupForm.value.githubUsername);
      } else {
        if (this.isEdit) {
          this.updateUserdetails();
        } else {
          this.signUpUser();
        }
      }
    } else {
      this.isLoading = false;
    }
  }

  checkGithubUserName(gitHubUsername: string) {
    this.githubService
      .checkUsername(gitHubUsername)
      .subscribe((isValid: boolean) => {
        if (isValid) {
          if (this.isEdit) {
            this.updateUserdetails();
          } else {
            this.signUpUser();
          }
        } else {
          this.isValidGithubUsername = true;
          this.isLoading = false;

          this.toastr.error(
            'Please entrer valid github user name',
            'Sign Up Failed!'
          );
        }
      });
  }
  updateUserdetails() {
    this.userService
      .updateUser(this.signupForm.value)
      .pipe(delay(DELAY_TIME))
      .subscribe(
        () => {
          this.toastr.success('', 'User Details Update sucsessfully!');
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;

          this.toastr.error('', 'User Details Updation Failed!');
        }
      );
  }
  signUpUser() {
    this.userService
      .signUp(this.signupForm.value)
      .pipe(delay(DELAY_TIME))
      .subscribe(
        (user: User) => {
          this.isLoading = false;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.toastr.success('', 'Sign Up sucsessfully!');
          this.router.navigate(['jobs']);
        },
        (err) => {
          this.isLoading = false;

          this.toastr.error('', 'Sign Up Failed!');
        }
      );
  }

  private updateFormFields(userType: string): void {
    const updateControl = (
      controlName: string,
      validators: any[] | null,
      value: any = null
    ) => {
      const control = this.signupForm.get(controlName);
      if (validators !== null) {
        control?.setValidators(validators);
      } else {
        control?.clearValidators();
      }
      if (value !== null) {
        control?.setValue(value);
      }
      control?.updateValueAndValidity();
    };

    updateControl(
      'companyName',
      userType === USER_TYPE.EMPLOYER ? [Validators.required] : null,
      userType === USER_TYPE.FREELANCER ? '' : null
    );

    if (userType === USER_TYPE.EMPLOYER) {
      updateControl('skills', null, []);
      updateControl('githubUsername', null, '');
    } else if (userType === USER_TYPE.FREELANCER) {
      updateControl('skills', [Validators.required]);
      updateControl('githubUsername', [Validators.required]);
    }
  }
}
