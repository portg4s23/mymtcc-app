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