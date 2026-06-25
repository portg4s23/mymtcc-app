import { GetUserQuery } from "@/hooks/use-current-user";
import { Me } from "@/hooks/use-me";
import { AppUser } from "@/models/AppUser.model";
import { Dayjs } from "dayjs";

export const getPayrollPeriod = (month: Dayjs): [Dayjs, Dayjs] => {
  const isAfter20 = month.isAfter(month.clone().date(20).endOf("day"));
  return isAfter20
    ? [
      month.clone().date(21).startOf("day"),
      month.clone().add(1, "month").date(20).endOf("day"),
    ]
    : [
      month.clone().subtract(1, "month").date(21).startOf("day"),
      month.clone().date(20).endOf("day"),
    ];
};

export function mapEmployeeUser(raw: GetUserQuery["employeeWithUUIDRaw"]): Partial<AppUser> {
  return {
    id: raw.id,
    name: raw.name,
    division: raw.division,
    isApprover: raw.isApprover,
    isManager: raw.isManager,
    isProxy: raw.isProxy || [5291, 5669].includes(raw.id),
    hasDashboardAccess: raw.hasDashboardAccess,
    isSiteAdmin: raw.isSiteAdmin,
    levelGrade: raw.levelGrade,
    roles: raw.roles?.map(r => r.role_id),
    workflows: raw.workflows,
    isBigOne: raw.isBigOne,
    odi_team: raw.odi_team,
    odi_team_position: raw.odi_team_position,
  };
}
export function mapMeUser(me: Me): Partial<AppUser> {
  return {
    id: me.id,
    name: me.fullName,
    email: me.email,
    division: me.division,
    phoneMobile: me.phoneMobile,
    phoneOffice: me.phoneOffice,
  };
}

export const log = (...args: any[]) => {
  const now = new Date();

  const time = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const ms = now.getMilliseconds().toString().padStart(3, "0");

  console.log(`[${time}.${ms}]`, ...args);
};

export const maskJwtToken = (token: string | null, visibleChars = 3): string => {
  if (!token || typeof token !== "string") return "";

  if (token.length <= visibleChars * 2) {
    return token; // too short to mask meaningfully
  }

  const start = token.slice(0, visibleChars);
  const end = token.slice(-visibleChars);

  return `${start}...${end}`;
};