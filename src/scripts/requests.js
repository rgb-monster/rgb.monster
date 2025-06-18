import axios from "axios";
import utils from "./utils.js";

export function requestFuncs(router) {
    let funcs = {
        async get(path) {
            let url = utils.serverUrl(path) + `?ts=${Date.now()}`;
            let res = await axios.get(url, {withCredentials: true});
            return res.data;
        },

        async post(path, data) {
            let url = utils.serverUrl(path) + `?ts=${Date.now()}`;
            return await axios.post(url, data, {withCredentials: true});
        },
    };
    return funcs;
}

// listen into all requests for redirects and such
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        // forward errors. we don't do global interception as sometimes the caller will want to control the exception
        // themselves
        return Promise.reject(error);
    }
);
