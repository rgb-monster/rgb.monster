import axios from "axios";
import utils from "./utils.js";

export function requestFuncs(router) {
    let funcs = {
        async get(path) {
            let url = utils.serverUrl(path) + `?ts=${Date.now()}`;
            let res = await axios.get(url, {withCredentials: true});
            return res.data;
        },

        async post(routeName, data, request, put = false) {
            let {params, query} = request || {};
            query = query || {};
            query["ts"] = Date.now();
            let url = router.resolve({name: routeName, params, query}).href;
            url = utils.serverUrl(url);

            let sender = put ? axios.put : axios.post;
            return await sender(url, data, {withCredentials: true});
        },

        async put(routeName, data, request) {
            // on the rare occasion when we pretend to be very RESTful
            return funcs.post(routeName, data, request, true);
        },

        async delete(routeName, request) {
            let {params, query} = request || {};
            query = query || {};
            query["ts"] = Date.now();
            let url = router.resolve({name: routeName, params, query}).href;
            url = utils.serverUrl(url);
            return axios.delete(url, {withCredentials: true});
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
