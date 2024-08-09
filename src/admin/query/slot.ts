import axios from 'axios';
const create = axios.create();
import {serverHeaders, serverURL} from '../../stuff'
import { slotProp } from '../types/slot';

export const bookSlotNow = (data: slotProp) => {
    return create.post(serverURL + '/c2/book-slot', data, {params: serverHeaders});
}

export const confirmSlotOrder = (data: slotProp) => {
    return create.post(serverURL + '/c2/confirm-book-slot', data, {params: serverHeaders});
}

export const searchInv = (data: string) => {
    return create.post(serverURL + '/c2/search-investor', {search: data}, {params: serverHeaders});
}

export const listSlot = (data:any) => {
    return create.post(serverURL + '/c2/list-slot', data, {params: serverHeaders});
}

export const slotComplete = (data:any) => {
    return create.post(serverURL + '/c2/slot-complete', {id:data}, {params: serverHeaders});
}

export const updateSlot = (data: slotProp) => {
    return create.post(serverURL + '/c2/update-slot', data, {params: serverHeaders});
}