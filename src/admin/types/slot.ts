import { planProps } from "./plan";

export type slotProp = {
  userid: string;
  dateofinvestment: string;
  investmentamount: number;
  investortype: string;
  plan: string;
  slot_no: string;
  agent: string;
  completed_at: string;
  roleid: string;
  order_id: string;
  paymentStatus: boolean;
  status: boolean;
};

export type createSlotProp = {
  plan: any;
  close: Function;
  returnData: any,
  editData: any
};

export type listSlotProp = {
    _id: string;
  userid: {
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    customerId: string;
    _id: string;
  };
  dateofinvestment: string;
  investmentamount: number;
  investortype: string;
  plan: { packageName: string };
  slot_no: string;
  agent: { name: string };
  completed_at: string;
  roleid: string;
  order_id: string;
  paymentStatus: boolean;
  status: boolean;
  created_at: string;
};

export const listSlotbookingProps: listSlotProp[] = [];
