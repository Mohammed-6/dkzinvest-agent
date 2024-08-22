import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
  deleteSecurityGroup,
  listSecurityGroup,
} from "../query/security-group";
import {
  listSecurityGroupsProps,
  securityGroupProps,
} from "../types/security-group";
import Link from "next/link";
import { toast } from "react-toastify";
import { listPageCustomer } from "../query/customer";
import { customerSearchProp, listCustomerProps } from "../types/customer";
import { Preloader } from "@/src/stuff";

const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState(listCustomerProps);
  const [searchdata, setsearchdata] = useState<customerSearchProp>({
    from: "",
    to: "",
    search: "",
    submit: true,
    status: "",
  });
  const [loading, setloading] = useState<boolean>(true);
  useEffect(() => {
    listPageCustomer(searchdata)
      .then((res) => {
        setcollectdata(res.data.data);
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
  }, []);

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setsearchdata({ ...searchdata, [evt.name]: evt.value });
  };

  const formSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const evt = e.target as HTMLSelectElement;
    setsearchdata({ ...searchdata, [evt.name]: evt.value });
  };

  const formSubmit = () => {
    listPageCustomer(searchdata)
      .then((res) => {
        setcollectdata(res.data.data);
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

  const daysAgo = (date: Date) => {
    // Assuming startDate and endDate are JavaScript Date objects
    const startDate: any = new Date(date);
    const endDate: any = new Date();

    // Calculate the difference in milliseconds
    const differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor(differenceInMs / millisecondsPerDay);
    return differenceInDays;
  };
  function getMemberSince(registrationDate) {
    const currentDate: any = new Date();
    const dd: any = new Date(registrationDate);
    const diffInMilliseconds = currentDate - dd;

    // Calculate years, months, and days
    const years = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60 * 24 * 365)) /
        (1000 * 60 * 60 * 24 * 30.436875)
    ); // Approximate months
    const days = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60 * 24 * 30.436875)) /
        (1000 * 60 * 60 * 24)
    );

    let memberSinceString = "";

    // Add years if they exist
    if (years > 0) {
      memberSinceString += `${years} year${years > 1 ? "s" : ""}`;
    }

    // Add months if they exist
    if (months > 0) {
      memberSinceString += `${years > 0 ? ", " : ""} ${months} month${
        months > 1 ? "s" : ""
      }`;
    }

    // Add days if they exist
    if (days > 0) {
      memberSinceString += `${years > 0 || months > 0 ? ", " : ""} ${days} day${
        days > 1 ? "s" : ""
      }`;
    }

    // Return the member since string
    return memberSinceString;
  }

  return (
    <>
      {loading ? <Preloader /> : ""}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between">
            <div>List Customer</div>
            <div></div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6 px-3">
          <div className="">
            <label>Search</label>
            <input
              type="text"
              name="search"
              className="form-input"
              onChange={formChange}
            />
          </div>
          <div className="">
            <label>From Date</label>
            <input
              type="date"
              name="from"
              className="form-input"
              onChange={formChange}
            />
          </div>
          <div className="">
            <label>To Date</label>
            <input
              type="date"
              name="to"
              className="form-input"
              onChange={formChange}
            />
          </div>
          <div className="">
            <label>Submit</label>
            <select
              className="w-full rounded-md px-2 py-3 border border-gray-200"
              name="submit"
              onChange={formSelectChange}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="">
            <label>Status</label>
            <select
              className="w-full rounded-md px-2 py-3 border border-gray-200"
              name="status"
              onChange={formSelectChange}
            >
              <option value="">Select</option>
              <option value="0">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
              <option value="3">Deleted</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary w-full" onClick={formSubmit}>
              Submit
            </button>
          </div>
        </div>
        <div className="card-body">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border">
                <td className="border p-2">S.No</td>
                <td className="border p-2">Name</td>
                <td className="border p-2">Mobile Number</td>
                <td className="border p-2">Email</td>
                <td className="border p-2">Submit</td>
                <td className="border p-2">Status</td>
                <td className="border p-2">Created on</td>
                <td className="border p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                collectdata !== undefined &&
                collectdata.map((data, i) => (
                  <tr>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">
                      {data.firstName + " " + data.lastName}
                    </td>
                    <td className="border p-2">{data.phone}</td>
                    <td className="border p-2">{data.email}</td>
                    <td className="border p-2">
                      {data.applicationSubmitted ? (
                        <div className="bg-green-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Yes
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full inline">
                          No
                        </div>
                      )}
                    </td>
                    <td className="border p-2">
                      {data.applicationStatus === 0 ? (
                        <div className="bg-yellow-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Pending
                        </div>
                      ) : data.applicationStatus === 1 ? (
                        <div className="bg-green-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Approved
                        </div>
                      ) : data.applicationStatus === 2 ? (
                        <div className="bg-red-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Rejected
                        </div>
                      ) : data.applicationStatus === 3 ? (
                        <div className="bg-red-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Deleted
                        </div>
                      ) : (
                        <div className="bg-yellow-500 text-white px-2 py-1 w-auto rounded-full inline">
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="border p-2">
                      {new Date(data.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="border p-2">
                      <div className="flex items-center gap-x-3">
                        <div className="">
                          <Link
                            href={"/admin/customer/view/" + data._id}
                            className="btn btn-primary"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListSG;
