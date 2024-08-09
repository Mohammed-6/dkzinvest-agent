import axios from 'axios';
const create = axios.create();
import {serverHeaders, serverURL} from '../../stuff'
// import  from '../types/report';

export const listPlanReport = () => {
    return create.get(serverURL + '/c2/report-plan', {params: serverHeaders});
}

export const listPlanWiseReport = (data:string, filter:any) => {
    return create.post(serverURL + '/c2/plan-wise-users',{currentPlan: data, filter}, {params: serverHeaders});
}

export const listPlanExpiriesReport = (data:string, filter:any) => {
    return create.post(serverURL + '/c2/list-plan-expires',{type: data, filter}, {params: serverHeaders});
}