import axios from "axios";
const create = axios.create();
import { serverHeaders, serverURL } from "../../stuff";
import { customerProps, customerSearchProp } from "../types/customer";


export const listPageCustomer = (data: customerSearchProp) => {
  return create.post(serverURL + "/c2/list-page-customer", data, {
    params: serverHeaders,
  });
};

export const customerDetail = (data:string) => {
  return create.post(serverURL + "/c2/customer-detail",{_id: data}, { params: serverHeaders });
};
