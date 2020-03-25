export interface IRestResponse {
  config?: any;
  data: IDataResponse;
  headers: any;
  statusText: string;
  status: number;
  request?: any;
}

export interface IDataResponse {
  status: 'success' | 'error';
  payload: {};
  error: any;
  message: string;
}

export interface IPaginationOpts {
  activePage: number,
  boundaryRange?: number,
  siblingRange?: number,
  showEllipsis?: boolean,
  showFirstAndLastNav?: boolean,
  showPreviousAndNextNav?: boolean,
  totalPages: number;
  itemPerPage: number;
}
