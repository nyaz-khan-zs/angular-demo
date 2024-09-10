export const GITHUB = {
  BASE_URL: 'https://api.github.com/users',
  REPOS: 'repos',
};
export enum SERVER_TYPE {
  API = 'api',
  MOCK = 'mock',
}
export const SERVER = SERVER_TYPE.MOCK;
export const FILE_PATH = {
  SKILLS: './../assets/skills.json',
  JOBS: './../assets/jobs.json',
  USERS: './../assets/users.json',
};
export const FILE_MAX_SIZE = 16 * 1024; // 16KB
export const API_ENDPOINT = {
  BASE_URL: '',
  USER: {
    USER_LIST: '/users',
    LOGIN: '/login',
  },
  JOBS: {
    JOBS_LIST: '/jobs',
  },
  SKILL: {
    SKILL_LIST: '/skills',
  },
};
export const DELAY_TIME = 2000;
