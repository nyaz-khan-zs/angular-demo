import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { maxFileSize } from '../../../core/validators/file-size.validator';
import { JobService } from 'src/app/services/job.service';
import { JobDetails } from 'src/app/models/job-details.model';
import { User } from 'src/app/models/user.model';
import { delay } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DELAY_TIME, FILE_MAX_SIZE } from 'src/app/core/utils/constant';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnInit, OnChanges {
  jobForm!: FormGroup;
  @Input() jobDetails!: JobDetails;
  @Input() userDetails?: User;
  fileContent: string | ArrayBuffer | null = null;
  skills: string[] = [];
  isEdditForm: boolean = false;
  isLoading: boolean = false;
  FILE_MAX_SIZE = FILE_MAX_SIZE;
  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private toastrService: ToastrService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isEdditForm = this.jobDetails?.id ? true : false;
    const file = localStorage.getItem('file');
    this.fileContent = file && this.isEdditForm ? JSON.parse(file) : null;
  }
  ngOnInit(): void {
    this.jobForm = this.createForm();
    this.jobService.getSkillList().subscribe((skills: string[]) => {
      this.skills = skills;
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [this.jobDetails?.id || ''],
      description: [
        this.fileContent,
        [Validators.required, maxFileSize(FILE_MAX_SIZE)],
      ],
      jobRole: [this.jobDetails?.jobRole || '', Validators.required],
      requirements: [this.jobDetails?.requirements || '', Validators.required],
      salary: [
        this.jobDetails?.salary || 0,
        [Validators.required, Validators.pattern(/^[+]?\d+(\.\d+)?$/)],
      ],
      skills: [this.jobDetails?.skills || [], Validators.required],
      applicantDetails: [[]],
      companyName: [this.userDetails?.companyName || '', Validators.required],
      email: [
        this.userDetails?.email || '',
        [Validators.required, Validators.email],
      ],
    });
  }

  getControl(name: string): AbstractControl | null {
    return this.jobForm.get(name);
  }

  getError(controlName: string, errorName: string): boolean {
    const control = this.getControl(controlName);
    return (
      control?.invalid &&
      (control?.touched || control?.dirty) &&
      control.errors?.[errorName]
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const control = this.getControl('description') as FormControl;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.fileContent = reader.result;
        localStorage.setItem('file', JSON.stringify(this.fileContent));

        control?.setValue(file);
      };

      reader.onerror = () => {
        console.error('File reading error');
      };

      reader.readAsText(file);
    } else {
      this.fileContent = null;
      control?.setValue(null);
    }

    control?.markAsTouched();
  }
  addSkill(newSkill: string): void {
    if (newSkill && !this.skills.includes(newSkill)) {
      this.skills.push(newSkill);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.jobForm.valid) {
      this.jobService
        .saveJob(this.jobForm.value)
        .pipe(delay(DELAY_TIME))
        .subscribe(
          (job) => {
            this.isLoading = false;
            this.toastrService.success('', 'Saved Sucessfully');
            if (this.isEdditForm) {
              this.router.navigate(['/jobs']);
            } else {
              this.jobForm.reset();
              this.fileContent = null;
              this.router.navigate(['/jobs']);
            }
          },
          (error) => {
            this.toastrService.error('', error);
          }
        );
    } else {
      this.isLoading = false;
    }
  }
}
