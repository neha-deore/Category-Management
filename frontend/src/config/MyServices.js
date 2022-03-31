import axios from "axios"
import { MAIN_URL } from "./Url"

export function addnewCategory(data) {
    return axios.post(`${MAIN_URL}products/addCategory`, data)
}
export function getAllCategories() {
    return axios.get(`${MAIN_URL}products/getAllCategories`)
}
export function getAllProduct(data) {
    return axios.post(`${MAIN_URL}products/getAllProduct/`,data)
}

export function subCategory(data) {
    return axios.post(`${MAIN_URL}products/subCategory`, data)
}

export function deteleSubCat(data) {
    return axios.post(`${MAIN_URL}products/deleteSubCategory`, data)
}

export function deteleCat(data) {
    return axios.post(`${MAIN_URL}products/deleteCategory`, data)
}

export function sendImages(data) {
    console.log(data)
    return axios.post(`${MAIN_URL}products/sendImages`, data,{
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}

export function deleteProduct(data) {
    return axios.post(`${MAIN_URL}products/deleteProduct`, data)
}

export function updateprod(data) {
    return axios.post(`${MAIN_URL}products/updateProd`, data)
}
