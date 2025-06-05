import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default {
    getHeader() {
        let token = window.localStorage.getItem('token');
        if(token == null) {
            return {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        return {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },
    get(url) {
        return axiosInstance.get(url, {
            headers: this.getHeader()
        });
    },
    post(url, data) {
        return axiosInstance.post(url, data, {
            headers: this.getHeader()
        });
    },
    delete(url) {
        return axiosInstance.delete(url, {
            headers: this.getHeader()
        });
    },
    put(url, data) {
        return axiosInstance.put(url, data, {
            headers: this.getHeader()
        });
    },
}
