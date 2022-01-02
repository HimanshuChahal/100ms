const axios = require("axios");

var jwt = require('jsonwebtoken');
var uuid4 = require('uuid4');

const BASE_URL = "http://localhost:3000/api"

var app_access_key = "61cdbc1f8d6d5fd351cbd6fb";
var app_secret = "CofUjIKaTGGr6I20a57qjgAe6DfNccLLXCvvKnntq_r57xUkm5tsDukMju1gz_c1TpPmHQGr13Cos-FNjezrZovcabfgfUd8xQAKrUiA7ldBzvynaYbJOE6HzhE1WlrP72ktvPx6Wp6MdVl4HEj3BXpuAqOHUVTXzwFxqK-iokA=";

const managementToken = async () =>
    jwt.sign(
        {
            access_key: app_access_key,
            type: 'management',
            version: 1,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000)
        },
        app_secret,
        {
            algorithm: 'HS256',
            expiresIn: '24h',
            jwtid: uuid4()
        },
    );


export const appToken = (room_id, user_id, role) =>
    jwt.sign(
        {
            access_key: app_access_key,
            room_id,
            user_id,
            role,
            type: 'app',
            version: 2,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000)
        },
        app_secret,
        {
            algorithm: 'HS256',
            expiresIn: '24h',
            jwtid: uuid4()
        },
    );

export const managementApiHelper = async (method, endpoint, body = {}) => {
    const token = await managementToken();
    console.log({ token });
    const api = axios.create({
        baseURL: BASE_URL,
        timeout: 5000,
        headers: { Authorization: `Bearer ${token}` },
    });
    try {
        const response = await api.request({
            url: endpoint,
            method: method,
            data: body,
        });
        return response.data;
    } catch (error) {
        console.log("Status: ", error.response.status);
        console.log("Text: ", error.response.statusText);
        // need to throw again so error is caught
        // a possible improvement here is to pass the status code back so it can be returned to the user
        throw new Error(error);
    }
};
