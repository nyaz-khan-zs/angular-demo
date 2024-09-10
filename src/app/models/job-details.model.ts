export interface JobDetails {
  id: string;
  companyName: string;
  email: string;
  jobRole: string;
  description: string;
  requirements: string;
  skills: string[];
  salary: number;
  applied?: boolean;
  applicantDetails: string[];
}
