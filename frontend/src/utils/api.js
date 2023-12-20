import axios from 'axios';

const APP_URL = "http://localhost:3002"

const CommonPostUrl = async(url , data , token) => {
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
const CommonGetUrl = async(url , data , token) => {
    await axios.get(`${APP_URL}/${url}`, data,{
        headers:{
            "Content-Type": "application/json",
            Authorization:`Bearer ${token ? token : ""}`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err)
    })
}
const CommonPutUrl = async(url , data , token) => {
    await axios.put(`${APP_URL}/${url}`, data,{
        headers:{
            "Content-Type": "application/json",
            Authorization:`Bearer ${token ? token : ""}`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err)
    })
}

const CommonDeleteUrl = async(url , data , token) => {
    await axios.put(`${APP_URL}/${url}`, data,{
        headers:{
            "Content-Type": "application/json",
            Authorization:`Bearer ${token ? token : ""}`
        }
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err)
    })
}

export {CommonPostUrl , CommonGetUrl , CommonPutUrl , CommonDeleteUrl}