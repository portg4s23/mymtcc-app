export type AppUser = {
  id: number;

  // identity
  name: string;

  // HR profile
  email?: string;
  rcno?: string;
  division: string;
  phoneMobile?: string | null;
  phoneOffice?: string | null;

  // permissions
  isApprover: boolean;
  isManager: boolean;
  isProxy: boolean;
  hasDashboardAccess: boolean;
  isSiteAdmin: boolean;

  roles: number[];
  workflows: {
    id: number;
    type_id: number;
    workflow_id: number;
  }[];

  levelGrade: string | number;
  isBigOne: boolean;

  odi_team: string | null;
  odi_team_position: string | null;
};