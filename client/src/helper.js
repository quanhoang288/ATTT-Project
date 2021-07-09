import {HOST_URL} from './config';


export const apiCall = (route, method, data=null) => {
    fetch(`${HOST_URL}/${route}`, {
        header: {
            "Content-Type": "aplication/json"
        },
        method: method,
        body: data,
    }).then(response => response.json());
}