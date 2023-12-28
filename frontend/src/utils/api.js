import axios from 'axios';

const APP_URL = "http://localhost:3002"

const token = JSON.parse(localStorage.getItem('user'))?.token ?? '';

console.log(token)

const CommonPostUrl = async(url , data) => {
    try {
        const response = await axios.post(`${APP_URL}/${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token ? token : ""}`
            }
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}


const CommonGetUrl = async(url  ) => {
    try {
        const response = await axios.get(`${APP_URL}/${url}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token ? token : ""}`
            }
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}
const CommonPutUrl = async(url , data ) => {
    try {
        const response = await axios.put(`${APP_URL}/${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token ? token : ""}`
            }
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}

const CommonDeleteUrl = async(url) => {
    try {
        const response = await axios.delete(`${APP_URL}/${url}`, {
            headers: {
                // "Content-Type": "application/json",
                'Authorization': `Bearer ${token ? token : ""}`
            }
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }
}

const CommonFileUpload = async(data) => {
    try {
        const response = await axios.post("https://api.imgbb.com/1/upload?expiration=63072000&key=7dfd97eb382b65ec8ec1a88ce98dfab1", data);

        console.log(response.data.data.url);   
        return response.data.data.url;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it to the caller
    }

}

export {CommonPostUrl , CommonGetUrl , CommonPutUrl , CommonDeleteUrl,CommonFileUpload}