import { Priority, Status } from '../constants';

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
