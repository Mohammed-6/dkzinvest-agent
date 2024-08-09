import axios from 'axios';
const create = axios.create();
import {serverHeaders, serverURL} from '../../stuff'
import { dashboardSearchProp } from '../types/dashboard';

export const agentDashboard = (data: dashboardSearchProp) => {
    return create.post(serverURL + '/c2/dashboard', data, {params: serverHeaders});
}