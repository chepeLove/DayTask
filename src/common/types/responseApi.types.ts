export type BaseResponseType<Data = {}> = {
  resultCode: number;
  messages: string[];
  data: Data;
  fieldsErrors?: FieldErrorType[];
};

export type FieldErrorType = {
  error: string;
  field: string;
};
