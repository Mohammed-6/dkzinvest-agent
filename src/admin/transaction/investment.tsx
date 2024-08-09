import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
  deleteSecurityGroup,
  listSecurityGroup,
} from "../query/security-group";
import {
  listCurrencyProps,
  currencyProps,
  editCurrencyProps,
} from "../types/currency";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  investmentProps,
  listInvestmentProps,
  listInvestmentPropss,
} from "../types/investment";
import {
  investmentCustomerList,
  listInvestment,
  listTransaction,
} from "../query/investment";
import { Preloader, formatIndianRupee } from "@/src/stuff";

const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState(listInvestmentPropss);
  const [loading, setloading] = useState<boolean>(true);
  const [eloading, seteloading] = useState<boolean>(false);

  const [prereq, setprereq] = useState<any>({
    plan: [],
    customer: [],
  });
  const [filter, setfilter] = useState<any>({
    clientId: "",
    fromDate: "",
    toDate: "",
    planId: "",
  });
  useEffect(() => {
    investmentCustomerList()
      .then((result: any) => {
        setloading(false);
        // console.log(result);
        setprereq({
          plan: result.data.data.plan,
          customer: result.data.data.customer,
        });
      })
      .catch((err) => {
        setloading(false);
        // console.error(err);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
  }, []);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setfilter({ ...filter, [evt.name]: evt.value });
  };

  const formSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setfilter({ ...filter, [evt.name]: evt.value });
  };
  const formSubmit = () => {
    setloading(true);
    console.log(filter);
    if (filter.clientId === "") {
      toast.error("Client id are required");
      setloading(false);
      return;
    }
    listInvestment(filter)
      .then((res) => {
        if (res.data.status === true) {
          setcollectdata(res.data.data);
        }
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        // console.error(err);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
  };
  return (
    <>
      {loading ? <Preloader /> : ""}
      <div className="grid grid-cols-1 gap-x-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>List Investment</div>
              <div></div>
            </div>
          </div>
          <div className="card-body">
            <div className="py-6">
              <div className="grid grid-cols-5 gap-x-4 items-center">
                <div className="">
                  <label>Select Client</label>
                  <select
                    className="w-full px-2 py-3 border border-gray-200 rounded-md"
                    onChange={formSelectChange}
                    name="clientId"
                  >
                    <option value="">Select</option>
                    {prereq.customer !== undefined &&
                      prereq.customer.map((req: any, i: number) => (
                        <option value={req._id}>
                          {req.firstName + " " + req.lastName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="">
                  <label>Select Plan</label>
                  <select
                    className="w-full px-2 py-3 border border-gray-200 rounded-md"
                    onChange={formSelectChange}
                    name="planId"
                  >
                    <option value="">Select</option>
                    {prereq.plan !== undefined &&
                      prereq.plan.map((req: any, i: number) => (
                        <option value={req._id}>{req.packageName}</option>
                      ))}
                  </select>
                </div>
                <div className="">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="w-full px-2 py-3 border border-gray-200 rounded-md"
                    onChange={formChange}
                  />
                </div>
                <div className="">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    className="w-full px-2 py-3 border border-gray-200 rounded-md"
                    onChange={formChange}
                  />
                </div>
                <div className="">
                  <button className="btn btn-success" onClick={formSubmit}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border">
                  <td className="border p-2">Created on</td>
                  <td className="border p-2">Client Name</td>
                  <td className="border p-2">Package Name</td>
                  <td className="border p-2">Investment Id</td>
                  <td className="border p-2">Amount</td>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  collectdata !== undefined &&
                  collectdata.map((data, i) => (
                    <tr>
                      <td className="border p-2">
                        {new Date(data.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="border p-2">
                        {data.customerId.firstName +
                          " " +
                          data.customerId.lastName}
                      </td>
                      <td className="border p-2">{data.planId.packageName}</td>
                      <td className="border p-2 text-blue-500">
                        {data.investmentId}
                      </td>
                      <td className="border p-2">
                        {formatIndianRupee(data.investmentAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSG;
