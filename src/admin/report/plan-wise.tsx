import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { Squares2X2Icon } from "@heroicons/react/16/solid";
import { listPlanReport } from "../query/report";
import { toast } from "react-toastify";
import Link from "next/link";
import { Preloader } from "@/src/stuff";

const ListSG = () => {
  return (
    <Layout>
      <Content />
    </Layout>
  );
};

const Content = () => {
  const [collectdata, setcollectdata] = useState<any>();
  const [loading, setloading] = useState<boolean>(true);
  useEffect(() => {
    listPlanReport()
      .then((res) => {
        if (res.data.status === true) {
          setcollectdata(res.data.data);
        } else {
          toast.error("Something went wrong");
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
  }, []);
  return (
    <>
      {loading ? <Preloader /> : ""}
      <div className="p-12">
        <div className="grid grid-cols-3">
          {collectdata !== undefined &&
            collectdata.map((data) => (
              <div className="">
                <Link
                  href={"/admin/investment/report/" + data.planId}
                  className=""
                >
                  <div className="pt-16 pb-4 border border-gray-100 px-4 w-full shadow-xl rounded-xl">
                    <Squares2X2Icon className="w-6 fill-primary" />
                    <br />
                    <h2 className="text-xl font-bold">{data.planName}</h2>
                    <div className="text-blue-500 flex font-bold gap-x-1">
                      <div className="tracking-wider">
                        ₹{data.balance.toLocaleString("en-IN")}
                      </div>
                      <div className="">({data.customerCount})</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ListSG;
