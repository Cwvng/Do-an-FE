export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Issue = {
  id: Id;
  columnId: Id;
  content: string;
};
