
export type dashboardSearchProp = {
    from: Date|string,
    to: Date|string
}

export type dashboardGraphProp = {
    leads: [],
    customer: [],
    conversion:string,
    investment: {date: [], amount: []},
    payout: {date: [], amount: []},
    commision: number,
    previous: {leads: number, customer: number, conversion: number, investment: number, payout: number, commision: number},
}