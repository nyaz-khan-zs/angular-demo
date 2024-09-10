export interface User {
  name: string;
  email: string;
  password: string;
  skills: string[];
  githubUsername: string;
  id: number;
  confirmPassword: string;
  userType: USER_TYPE;
  companyName?: string;
}
export enum USER_TYPE {
  EMPLOYER = 'employer',
  FREELANCER = 'freelancer',
}

export interface UserLogedIn {
  email: string;
  password: string;
  userType: USER_TYPE;
}
