export interface User {
  pn: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}
