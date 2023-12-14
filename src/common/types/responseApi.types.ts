export type ResponseType<Data = {}> = {
  resultCode: number;
  messages: string[];
  data: Data;
};
