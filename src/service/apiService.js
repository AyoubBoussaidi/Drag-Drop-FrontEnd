
import axios from 'axios';

const ApiService = {
    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    get(resource, params) {
        return axios.get(resource, { params });
    },

    post(resource, data) {
        return axios.post(resource, data);
    },
    delete(resource, data) {
        return axios.delete(resource, data);
    },
    patch(resource, data) {
        return axios.patch(resource, data).catch((error) => {
            throw error;
        });

    },
};

export default ApiService;
