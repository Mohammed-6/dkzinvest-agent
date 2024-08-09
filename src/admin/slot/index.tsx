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
import { createSlotProp, listSlotbookingProps } from "../types/slot";

import useRazorpay from "react-razorpay";
import {
  bookSlotNow,
  confirmSlotOrder,
  listSlot,
  searchInv,
  slotComplete,
  updateSlot,
} from "../query/slot";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState(listplanProps);
  const [slotdata, setslotdata] = useState(listSlotbookingProps);
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
  const [addedit, setaddedit] = useState<boolean>(false);
  const [editdata, seteditdata] = useState<any>();
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
    listSlot({})
      .then((res) => {
        setslotdata(res.data.data);
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

  const editPlan = (data: planProps) => {
    seteloading(false);
    seteditcollectdata(data);
    seteloading(true);
  };

  const slotCompleted = (data: string) => {
    slotComplete(data)
      .then((res) => {
        setslotdata(res.data.data);
        setloading(false);
        toast.success("Slot Updated Successfully");
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

  const closeEditPopup = () => {
    setaddedit(false);
  };

  const openEditPopup = () => {
    setaddedit(true);
    seteditdata(undefined);
  };

  const updateRecord = (data: any) => {
    setslotdata(data);
  };
  function formatDateToInput(date: Date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const editSlot = (data: any, id: string) => {
    const colte = {
      _id: data._id,
      userid: id,
      dateofinvestment: formatDateToInput(data.dateofinvestment),
      investmentamount: data.investmentamount,
      investortype: data.investortype,
      plan: data.plan._id,
      slot_no: data.slot_no,
      agent: data.agent._id,
      completed_at: data.completed_at,
      roleid: data.roleid,
      order_id: data.order_id,
      paymentStatus: data.paymentStatus,
      status: data.paymentStatus,
    };
    console.log(data.userid);
    seteditdata(colte);
    setaddedit(true);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-x-4">
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between">
              <div>List Slot</div>
              <div>
                <button className="btn btn-primary" onClick={openEditPopup}>
                  Add Slot
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border">
                  <td className="border p-2">S.No</td>
                  <td className="border p-2">Agent Name</td>
                  <td className="border p-2">Investor Name</td>
                  <td className="border p-2">Invest Amount</td>
                  <td className="border p-2">Plan Name</td>
                  <td className="border p-2">Created At</td>
                  <td className="border p-2">Payment Status</td>
                  <td className="border p-2">Investment Status</td>
                </tr>
              </thead>
              <tbody>
                {slotdata !== undefined &&
                  slotdata.map((data, i) => (
                    <tr>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{data.agent.name}</td>
                      <td className="border p-2">
                        {data.userid.firstName + " " + data.userid.lastName}
                      </td>
                      <td className="border p-2">
                        {formatIndianRupee(data.investmentamount)}
                      </td>
                      <td className="border p-2">{data.plan.packageName}</td>
                      <td className="border p-2">
                        {new Date(data.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="border p-2">
                        {data.paymentStatus ? (
                          <div className="text-white bg-green-500 rounded-full px-5 py-2 w-fit">
                            Paid
                          </div>
                        ) : (
                          <div className="text-white bg-red-500 text-center rounded-full px-5 py-2 w-fit">
                            Unpaid
                          </div>
                        )}
                      </td>
                      <td className="border p-2">
                        {data.completed_at !== null ? (
                          <div className="text-white bg-green-500 rounded-full px-5 py-2 w-fit">
                            {new Date(data.completed_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              }
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-x-3">
                            <div className="">
                              <button
                                className=""
                                title="Completed"
                                onClick={() =>
                                  editSlot(data, data.userid.email)
                                }
                              >
                                <PencilIcon className="w-10 bg-green-300 rounded-full p-3" />
                              </button>
                            </div>
                            <div className="text-white bg-red-500 text-center rounded-full px-5 py-2 w-fit">
                              Not invested
                            </div>
                            <div className="">
                              <button
                                className=""
                                title="Completed"
                                onClick={() => slotCompleted(data._id)}
                              >
                                <CheckIcon className="w-10 bg-green-300 rounded-full p-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {addedit ? (
        <CreateSlot
          plan={collectdata}
          close={closeEditPopup}
          returnData={updateRecord}
          editData={editdata}
        />
      ) : (
        ""
      )}
    </>
  );
};

const CreateSlot = (props: createSlotProp) => {
  const [collectdata, setcollectdata] = useState({
    _id: "",
    userid: "",
    dateofinvestment: "",
    investmentamount: 0,
    investortype: "",
    plan: "",
    slot_no: "",
    agent: "",
    completed_at: "",
    roleid: "",
    order_id: "",
    paymentStatus: false,
    status: true,
  });
  const [search, setsearch] = useState<string>("");
  const [founduser, setfounduser] = useState({
    status: false,
    firstName: "",
    lastName: "",
    email: "",
    _id: "",
    referralCode: "",
    customerId: "",
  });

  const [Razorpay] = useRazorpay();

  useEffect(() => {
    console.log(props);
    if (props.editData !== undefined && props.editData.userid !== undefined) {
      console.log(props.editData);
      const colte = props.editData;
      setcollectdata(props.editData);
      setsearch(colte.userid);
      searchInv(colte.userid).then((res) => {
        if (res.data.type === true) {
          setfounduser({
            ...founduser,
            status: true,
            firstName: res.data.data.firstName,
            lastName: res.data.data.lastName,
            email: res.data.data.email,
            referralCode: res.data.data.referralCode,
            _id: res.data.data._id,
          });
          //   toast.success("User found");
          colte.userid = res.data.data._id;
          setcollectdata(colte);
          //   setcollectdata({ ...collectdata, userid: res.data.data._id });
        } else {
          toast.error("User not found");
        }
      });
    }
  }, []);

  const justifyClick = () => {
    if (collectdata._id !== "") {
      if (collectdata.dateofinvestment === "") {
        toast.error("Date of investment required");
        return;
      } else if (collectdata.investmentamount < 0) {
        toast.error("Investment Amount required");
        return;
      } else if (collectdata.userid === "") {
        toast.error("Please enter or search investor");
        return;
      } else if (collectdata.plan === "") {
        toast.error("Please select plan");
        return;
      }
      updateSlot(collectdata)
        .then(() => {
          toast.success("Slot udpated successfully");
          props.close();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      investNow();
    }
  };

  const investNow = () => {
    if (collectdata.dateofinvestment === "") {
      toast.error("Date of investment required");
      return;
    } else if (collectdata.investmentamount < 0) {
      toast.error("Investment Amount required");
      return;
    } else if (collectdata.userid === "") {
      toast.error("Please enter or search investor");
      return;
    } else if (collectdata.plan === "") {
      toast.error("Please select plan");
      return;
    }

    bookSlotNow(collectdata).then(function (res) {
      setcollectdata({
        ...collectdata,
        userid: res.data._id,
        order_id: res.data.data.id,
        paymentStatus: true,
      });
      console.log(res);
      const options = {
        key: "rzp_test_s7rXzSSkEG43th",
        amount: "50000",
        currency: "INR",
        name: "DKZ Investment",
        description: "slot booking",
        image: "https://www.dikazo.com/assets/images/dikazo-logo-main.png",
        order_id: res.data.data.id,
        handler: function (response: any) {
          //   alert(response.razorpay_payment_id);
          //   alert(response.razorpay_order_id);
          //   alert(response.razorpay_signature);
          confirmSlotOrder(collectdata).then(function (res) {
            // console.log(res);
            //   router.push("/payment?order_id=" + response.razorpay_order_id);
            if (res.data.type === true) {
              props.returnData(res.data.data);
              toast.success(res.data.message);
              props.close();
            } else {
              toast.error(res.data.message);
            }
          });
        },
        prefill: {
          name: res.data.detail.firstName + res.data.detail.lastName,
          email: res.data.detail.email,
          contact: res.data.detail.phone,
        },
        notes: {
          address: "investment amount",
        },
        theme: {
          color: "#10A37F",
        },
      };
      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", function (response: any) {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        toast.error(response.error.description);
      });

      rzp1.open();
    });
  };

  const formChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setsearch(evt.value);
  };

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const formSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setcollectdata({ ...collectdata, [evt.name]: evt.value });
  };

  const searchInvestor = () => {
    searchInv(search).then((res) => {
      if (res.data.type === true) {
        setcollectdata({ ...collectdata, userid: res.data.data._id });
        setfounduser({
          ...founduser,
          status: true,
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          email: res.data.data.email,
          referralCode: res.data.data.referralCode,
          _id: res.data.data._id,
        });
        toast.success("User found");
      } else {
        toast.error("User not found");
      }
    });
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50">
        <div className="mx-auto max-w-xl top-6">
          <div className="card">
            <div className="card-header">Book Slot</div>
            <div className="card-body">
              <div className={`${founduser.status ? "block" : "hidden"}`}>
                <div className="border-2 border-gray-300 rounded-lg p-2 my-3">
                  <ul>
                    <li>
                      Name:{" "}
                      <b>{founduser.firstName + " " + founduser.lastName}</b>
                    </li>
                    <li>
                      Email: <b>{founduser.email}</b>
                    </li>
                    <li>
                      User ID: <b>{founduser.customerId}</b>
                    </li>
                    <li>
                      Ref ID: <b>{founduser.referralCode}</b>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="">
                <label>Search Investor</label>
                <div className="flex items-center gap-x-3">
                  <div className="">
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="Enter USER_ID / EMAIL_ID / MOBILE_NO"
                      onChange={formChangeSearch}
                      value={search}
                    />
                  </div>
                  <div className="">
                    <button
                      className="btn btn-success"
                      onClick={searchInvestor}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="">
                <label>Investment Amount</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="1000000"
                  name="investmentamount"
                  onChange={formChange}
                  value={collectdata.investmentamount}
                />
              </div>
              <div className="">
                <label>Date of Investment</label>
                <input
                  type="date"
                  className="form-input"
                  name="dateofinvestment"
                  onChange={formChange}
                  value={collectdata.dateofinvestment}
                />
              </div>
              <div className="">
                <label>Investment Type</label>
                <select
                  className="form-input"
                  name="investortype"
                  onChange={formSelectChange}
                  value={collectdata.investortype}
                >
                  <option value={"Old"}>Old</option>
                  <option value={"New"}>New</option>
                  <option value={"Addon"}>Addon</option>
                </select>
              </div>
              <div className="">
                <label>Package(Plan)</label>
                <select
                  className="form-input"
                  name="plan"
                  onChange={formSelectChange}
                  value={collectdata.plan}
                >
                  <option value={""}>Select</option>
                  {props.plan !== undefined &&
                    props.plan.map((data: planProps) => (
                      <option value={data._id}>{data.packageName}</option>
                    ))}
                </select>
              </div>
              <div className="flex justify-between">
                <div className="">
                  <button
                    className="btn btn-primary mt-2"
                    onClick={justifyClick}
                  >
                    Submit
                  </button>
                </div>
                <div className="">
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => props.close()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSG;
