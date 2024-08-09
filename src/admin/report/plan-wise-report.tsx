import React, { useState, useEffect } from "react";
import Layout from "../layout";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { listPlanWiseReport } from "../query/report";
import { listPlanwiseReportProps } from "../types/report";
import { investmentCustomerList, listTransaction } from "../query/investment";
import { Preloader } from "@/src/stuff";

const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const router = useRouter();
  const [collectdata, setcollectdata] = useState(listPlanwiseReportProps);
  const [planname, setplanname] = useState<string>("");
  const [loading, setloading] = useState<boolean>(true);
  const [prereq, setprereq] = useState<any>({
    plan: [],
    customer: [],
  });
  const [filter, setfilter] = useState<any>({
    clientId: "",
    fromDate: "",
    toDate: "",
  });
  useEffect(() => {
    listPlanWiseReport(router.query.planid as string, filter)
      .then((result: any) => {
        // console.log(result);
        setcollectdata(result.data.data);
        setplanname(result.data.package);
        setloading(false);
      })
      .catch((err) => {
        // console.error(err);
        setloading(false);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
    investmentCustomerList()
      .then((result: any) => {
        // console.log(result);
        setprereq({
          plan: result.data.data.plan,
          customer: result.data.data.customer,
        });
      })
      .catch((err) => {
        // console.error(err);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
  }, [router.isReady]);

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
      return;
    }
    listPlanWiseReport(router.query.planid as string, filter)
      .then((result: any) => {
        // console.log(result);
        setcollectdata(result.data.data);
        setplanname(result.data.package);
        setloading(false);
      })
      .catch((err) => {
        // console.error(err);
        setloading(false);
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
            <div className="flex justify-between font-bold">
              <div>Plan-Wise Data ({planname})</div>
              <div>
                {/* <button
                  className="btn btn-primary"
                >
                  Add Trasnaction
                </button> */}
              </div>
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
                  <td className="border p-2">SL.No</td>
                  <td className="border p-2">Client ID</td>
                  <td className="border p-2">Client Name</td>
                  <td className="border p-2">Capital Investment</td>
                  <td className="border p-2">Activation Date</td>
                  <td className="border p-2">Payout Time Period</td>
                  <td className="border p-2">Created At</td>
                </tr>
              </thead>
              <tbody>
                {collectdata !== undefined &&
                  collectdata.map((data, i) => (
                    <tr>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{data.customerId}</td>
                      <td className="border p-2">{data.clientName}</td>
                      <td className="border p-2">₹{data.capitalInvested}</td>
                      <td className="border p-2">
                        {new Date(data.capitalDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          }
                        )}
                      </td>
                      <td className="border p-2">{data.payoutOutTimePeriod}</td>
                      <td className="border p-2">
                        {new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
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
