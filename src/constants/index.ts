export enum Status {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  WAITING_REVIEW = 'waiting_review',
  TESTING = 'testing',
  FEEDBACK = 'feedback',
}
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
export enum Message {
  CREATED = 'Created successfully',
  DELETED = 'Deleted successfully',
  UPDATED = 'Updated successfully',
}
export enum IssueType {
  BUG = 'bug',
  TASK = 'task',
  SUB_TASK = 'subtask',
}
