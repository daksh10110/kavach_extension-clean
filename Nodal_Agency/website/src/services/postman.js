import axios from 'axios'
const baseurl = "http://192.168.234.96:3001/persons"

const GetAll = () => {
    const request = axios.get(baseurl)
    return request.then(response => response.data)
}

const Create = (newobject) => {
    const request =axios.post(baseurl,newobject)
    return request.then(response=> response.data)
}

export default {GetAll , Create}