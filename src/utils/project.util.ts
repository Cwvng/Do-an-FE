import { Priority, Status } from '../constants';
import moment from 'moment';

export const toCapitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const getStatusTagColor = (status: string): string => {
  switch (status) {
    case Status.DONE:
      return 'blue';
    case Status.IN_PROGRESS:
      return 'yellow';
    case Status.WAITING_REVIEW:
      return 'orange';
    case Status.FEEDBACK:
      return 'red';
    case Status.NEW:
      return 'green';
    case Priority.LOW:
      return 'green';
    case Priority.MEDIUM:
      return 'yellow';
    case Priority.HIGH:
      return 'orange';
    case Priority.URGENT:
      return 'red';
    default:
      return 'green';
  }
};
export const getRemainingDay = (date: string) => {
  const endDate = moment(date);
  const now = moment();

  const diff = endDate.diff(now, 'days');
  const diffDays = diff % 7;
  const diffWeeks = Math.floor(diff / 7);
  return diffWeeks + 'w ' + diffDays + 'd';
};
export const getRemainingDaysPercent = (date: string) => {
  const endDate = moment(date);
  const now = moment();
  const diff = endDate.diff(now, 'days');
  return 100 - Math.floor((diff / 14) * 100);
};
