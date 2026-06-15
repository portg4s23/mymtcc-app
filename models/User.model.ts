export interface User {
  id: string;
  email: string;
  division?: string;
  divisionId?: string;
  divisionCode?: string;
  phoneMobile?: string;
  phoneOffice?: string;
  fullName: string;
  rcno: number
  permissions: string[];
}