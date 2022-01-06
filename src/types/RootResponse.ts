type RootResponse = {
  code: number;
  msg: string;
  records: Records[];
};

type Records = {
  key: string;
  createdAt: string;
  totalCount: number;
};
export default RootResponse;
