import React, { useState, useEffect } from "react";
import Layout from "../layout";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Preloader, formatIndianRupee, serverURL } from "@/src/stuff";
import dynamic from "next/dynamic";
import { agentDashboard } from "../query/dashboard";
import { dashboardGraphProp, dashboardSearchProp } from "../types/dashboard";
import { useRouter } from "next/router";
import Link from "next/link";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  return (
    <>
      <Layout>
        <div className="p-6">
          <Reports />
        </div>
      </Layout>
    </>
  );
};

const Reports = () => {
  const router = useRouter();
  const [searchdata, setsearchdata] = useState<dashboardSearchProp>({
    from: "",
    to: "",
  });
  const [collectdata, setcollectdata] = useState<dashboardGraphProp>({
    leads: [],
    customer: [],
    conversion: "",
    investment: { date: [], amount: [] },
    payout: { date: [], amount: [] },
    commision: 0,
    previous: {
      leads: 0,
      customer: 0,
      conversion: 0,
      investment: 0,
      payout: 0,
      commision: 0,
    },
  });
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    getRecords();
  }, [router.isReady]);
  const getRecords = () => {
    setloading(true);
    agentDashboard(searchdata).then((res: any) => {
      // console.log(colte);
      if (res.data.status === true) {
        const colte = res.data.data;
        const invAgg: any =
          colte.investment !== undefined && colte.investment.length !== 0
            ? aggregateAmountWithDate(colte.investment)
            : [];
        const payAgg: any =
          colte.payout !== undefined && colte.payout.length !== 0
            ? aggregateAmountWithDate(colte.payout)
            : [];
        console.log(invAgg, payAgg);
        colte.investment = invAgg;
        colte.payout = payAgg;
        console.log(colte);
        setcollectdata(colte);
      }
      setloading(false);
    });
  };

  const aggregateAmountWithDate = (investments: any) => {
    // Create an object to store the aggregated sums by date
    const aggregatedInvestments = {};

    for (let i = 0; i < investments.amount.length; i++) {
      const date = investments.date[i];
      const amount = investments.amount[i];

      if (aggregatedInvestments[date]) {
        aggregatedInvestments[date] += amount;
      } else {
        aggregatedInvestments[date] = amount;
      }
    }
    // Convert the aggregated object into separate date and amount arrays
    const result = {
      amount: [],
      date: [],
    };

    for (const [date, amount] of Object.entries(aggregatedInvestments)) {
      result.date.push(date);
      result.amount.push(amount);
    }

    return result;
  };
  const graph1 = {
    options: {
      chart: {
        id: "investment",
      },
      xaxis: {
        categories: collectdata?.investment?.date,
      },
    },
    series: [
      {
        name: "Investment",
        data: collectdata?.investment?.amount,
      },
    ],
    dataLabels: {
      position: "top",
      enabled: true,
      textAnchor: "start",
      style: {
        fontSize: "10pt",
        colors: ["#000"],
      },
      offsetX: 0,
      horizontal: true,
      dropShadow: {
        enabled: false,
      },
    },
  };
  const graph2 = {
    options: {
      chart: {
        id: "investment-payout",
      },
      xaxis: {
        categories: collectdata?.investment?.date,
      },
    },
    series: [
      {
        name: "Investment",
        data: collectdata?.investment?.amount,
      },
      {
        name: "Payout",
        data: collectdata?.payout?.amount,
      },
    ],
  };
  const graph3 = {
    series: [
      {
        name: "Investment",
        data: collectdata?.investment?.amount,
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: collectdata?.investment?.date,
      },
    },
  };
  const piegraph = {
    series: [
      collectdata?.customer !== undefined ? collectdata?.customer.length : 0,
      collectdata?.leads !== undefined ? collectdata?.leads.length : 0,
    ],
    options: {
      chart: {
        type: "pie",
        // height: 350,
      },
      labels: ["Customer", "Leads"],
      title: {
        text: "Investment Distribution",
        align: "center",
      },
    },
  };

  function getAmount(numbers: any) {
    let sum = 0;
    if (numbers !== undefined) {
      for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
      }
    }
    return sum;
  }

  const formChange = (e: React.FormEvent<HTMLInputElement>) => {
    const evt = e.target as HTMLInputElement;
    setsearchdata({ ...searchdata, [evt.name]: evt.value });
  };
  function getPercentageText(number: number) {
    const formattedNumber = number; // Format to two decimal places
    const isPositive = number >= 0;
    const textColorClass = isPositive ? "text-green-500" : "text-red-500";
    const percentageSign = isPositive ? "+" : "-";
    return `<span class="${textColorClass}">${percentageSign}${formattedNumber}%</span>`;
  }

  return (
    <>
      {loading ? <Preloader /> : ""}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="font-bold">Showing Last 1 month</div>
          <div className="flex items-center gap-x-4">
            <div className="">
              <label>From Date</label>
              <br />
              <input
                type="date"
                className="px-3 py-2 rounded-md bg-gray-100"
                onChange={formChange}
                name="from"
              />{" "}
            </div>
            <div className="">
              <label>To Date</label>
              <br />
              <input
                type="date"
                className="px-3 py-2 rounded-md bg-gray-100"
                onChange={formChange}
                name="to"
              />{" "}
            </div>
            <div className="">
              <label className="opacity-0">A</label>
              <button className="btn btn-success mt-6" onClick={getRecords}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="bg-white shadow-md duration-300 hover:shadow-lg border border-gray-100 p-6 rounded-lg">
            <h5 className="font-bold pb-1 text-gray-400">Leads</h5>
            <h2 className="flex items-center gap-x-2">
              <div className="text-4xl font-bold">
                {collectdata.customer.length - collectdata.leads.length}
              </div>
              <div className={`font-bold`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPercentageText(collectdata.previous.leads),
                  }}
                />
              </div>
            </h2>
            <Link
              href={"/admin/customer"}
              className="text-green-500 flex items-center font-bold pt-4"
            >
              See Reports <ChevronRightIcon className="w-6 stroke-green-500" />
            </Link>
          </div>
          <div className="bg-white shadow-md duration-300 hover:shadow-lg border border-gray-100 p-6 rounded-lg">
            <h5 className="font-bold pb-1 text-gray-400">Investor</h5>
            <h2 className="flex items-center gap-x-2">
              <div className="text-4xl font-bold">
                {collectdata.leads.length}
              </div>
              <div className={`font-bold`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPercentageText(collectdata.previous.customer),
                  }}
                />
              </div>
            </h2>
            <Link
              href={"/admin/customer"}
              className="text-green-500 flex items-center font-bold pt-4"
            >
              See Reports <ChevronRightIcon className="w-6 stroke-green-500" />
            </Link>
          </div>
          <div className="bg-white shadow-md duration-300 hover:shadow-lg border border-gray-100 p-6 rounded-lg">
            <h5 className="font-bold pb-1 text-gray-400">Conversion</h5>
            <h2 className="flex items-center gap-x-2">
              <div className="text-4xl font-bold">
                {collectdata?.conversion}%
              </div>
              <div className={`font-bold`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPercentageText(collectdata.previous.conversion),
                  }}
                />
              </div>
            </h2>
            <Link
              href={"/admin/customer"}
              className="text-green-500 flex items-center font-bold pt-4"
            >
              See Reports <ChevronRightIcon className="w-6 stroke-green-500" />
            </Link>
          </div>
          <div className="bg-white shadow-md duration-300 hover:shadow-lg border border-gray-100 p-6 rounded-lg">
            <h5 className="font-bold pb-1 text-gray-400">Investment</h5>
            <h2 className="flex items-center gap-x-2">
              <div className="text-4xl font-bold">
                {formatIndianRupee(getAmount(collectdata?.investment?.amount))}
              </div>
              <div className={`font-bold`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPercentageText(collectdata.previous.investment),
                  }}
                />
              </div>
            </h2>
            <Link
              href={"/admin/investment"}
              className="text-green-500 flex items-center font-bold pt-4"
            >
              See Reports <ChevronRightIcon className="w-6 stroke-green-500" />
            </Link>
          </div>
          <div className="bg-white shadow-md duration-300 hover:shadow-lg border border-gray-100 p-6 rounded-lg">
            <h5 className="font-bold pb-1 text-gray-400">Commision</h5>
            <h2 className="flex items-center gap-x-2">
              <div className="text-4xl font-bold">
                {formatIndianRupee(collectdata?.commision)}
              </div>
              <div className={`font-bold`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPercentageText(collectdata.previous.commision),
                  }}
                />
              </div>
            </h2>
            <Link
              href={"/admin/investment"}
              className="text-green-500 flex items-center font-bold pt-4"
            >
              See Reports <ChevronRightIcon className="w-6 stroke-green-500" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 py-6">
          <div className="">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>Investment</div>
                  <div>
                    <Link
                      href={"/admin/investment"}
                      className="text-blue-500 text-sm"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* <Chart
                  options={graph1.options}
                  series={graph1.series}
                  type="bar"
                /> */}
                <Chart
                  options={graph3.options}
                  series={graph3.series}
                  type="bar"
                />{" "}
              </div>
            </div>
          </div>
          <div className="">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>Investment vs. Payout</div>
                  <div>
                    <Link
                      href={"/admin/investment"}
                      className="text-blue-500 text-sm"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <Chart
                  options={graph2.options}
                  series={graph2.series}
                  type="line"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 py-6">
          <div className="">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>Customer vs Conversion Rate</div>
                  <div>
                    <Link
                      href={"/admin/customer"}
                      className="text-blue-500 text-sm"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <Chart
                  options={piegraph.options}
                  series={piegraph.series}
                  type="pie"
                  height={350}
                />
              </div>
            </div>
          </div>
          <div className="">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>Recent Lead</div>
                  <div>
                    <Link
                      href={"/admin/customer"}
                      className="text-blue-500 text-sm"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {collectdata.customer !== undefined &&
                  collectdata.customer.map((data: any, i: number) => {
                    if (i === 4) {
                      return;
                    }
                    function formatMongoDate(mongoDate) {
                      const date = new Date(mongoDate);
                      const options: any = {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      };
                      return date.toLocaleDateString("en-US", options);
                    }
                    return (
                      <div className="grid grid-cols-12 items-center justify-around border-t border-b border-t-gray-200 border-b-gray-200 py-3">
                        <div className="col-span-7">
                          <div className="flex items-center gap-x-3">
                            <div className="">
                              <img
                                src={
                                  serverURL +
                                  "/" +
                                  data?.profilePhoto?.docId?.path
                                }
                                className="w-14 h-14 object-cover object-center rounded-full shadow-md"
                              />
                            </div>
                            <div className="">
                              <h2 className="text-black font-bold">
                                {data?.firstName + " " + data?.lastName}
                              </h2>
                              <h2 className="text-gray-500 font-bold">
                                {data?.email}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <h2 className="text-gray-500 font-bold">
                            {formatMongoDate(data?.created_at)}
                          </h2>
                        </div>
                        <div className="col-span-2">
                          <h2 className="text-black font-bold">
                            {formatIndianRupee(50000)}
                          </h2>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
