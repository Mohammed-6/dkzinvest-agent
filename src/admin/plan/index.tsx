import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
  deleteSecurityGroup,
  listSecurityGroup,
} from "../query/security-group";
import { listplanProps, planProps, editPlanProps } from "../types/plan";
import Link from "next/link";
import { toast } from "react-toastify";
import { createPlan, deletePlan, listPlan, updatePlan } from "../query/plan";
import { formatIndianRupee } from "@/src/stuff";

const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState(listplanProps);
  const [editcollectdata, seteditcollectdata] = useState<planProps>({
    _id: "",
    packageName: "",
    duration: null,
    percentage: null,
    payoutPeriod: "",
    capitalReturn: false,
    withdrawInstallment: null,
    minAmount: 0,
    maxAmount: 0,
    terms: "",
    offerClaim: "",
    banner: "",
    status: true,
    created_at: new Date(),
  });
  const [loading, setloading] = useState<boolean>(false);
  const [eloading, seteloading] = useState<boolean>(false);
  useEffect(() => {
    listPlan()
      .then((res) => {
        setcollectdata(res.data.data);
        setloading(true);
      })
      .catch((err) => {
        // console.error(err);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
  }, []);

  const deleteUsr = (deleteid: string) => {
    deletePlan(deleteid)
      .then((res) => {
        setloading(false);
        setcollectdata(res.data.data);
        setloading(true);
        toast.success("Franchise deleted successfully");
      })
      .catch((err) => {
        // console.error(err);
        if (err.response.status === 400) {
          toast.error(err.response.statusText);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  const editPlan = (data: planProps) => {
    seteloading(false);
    seteditcollectdata(data);
    seteloading(true);
  };

  const closeEditPopup = () => {
    seteloading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>List Plan</div>
              <div>
                {/* <a href="/admin/user/create" className="btn btn-primary">
                  Create
                </a> */}
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border">
                  <td className="border p-2">S.No</td>
                  <td className="border p-2">Package Name</td>
                  <td className="border p-2">Duration</td>
                  <td className="border p-2">Terms</td>
                  <td className="border p-2">Offer Claim</td>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  collectdata !== undefined &&
                  collectdata.map((data, i) => (
                    <tr>
                      <td className="border p-2 w-[5%]">{i + 1}</td>
                      <td className="border p-2 w-[20%]">{data.packageName}</td>
                      <td className="border p-2 w-[20%]">
                        <div className="">
                          <b>Duration</b>: {data.duration + " Month"}
                          <br />
                          <b>Percentage</b>:&nbsp;{data.percentage}%
                          <br />
                          <b>Payout&nbsp;Period</b>:&nbsp;
                          {data.payoutPeriod.replace(" ", "")}
                          <br />
                          <b>Capital return</b>:{" "}
                          {data.capitalReturn ? "Yes" : "No"}
                          <br />
                          <b>Max Amount</b>:{formatIndianRupee(data.maxAmount)}
                          <br />
                          <b>Min Amount</b>:{formatIndianRupee(data.minAmount)}
                        </div>
                      </td>
                      <td className="border p-2 w-[25%]">
                        <div className="whitespace-pre-line">{data.terms}</div>
                      </td>
                      <td className="border p-2 w-[25%]">
                        <div className="whitespace-pre-line">
                          {data.offerClaim}
                        </div>
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
