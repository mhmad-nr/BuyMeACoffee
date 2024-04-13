import axios, { AxiosResponse } from "axios"

const post = (url: string, data: any, config?: any): Promise<AxiosResponse<any, any>> => {
    return new Promise((success, fail) => {
        axios.post(url, data, config)
            .then(result => {
                success(result)
            }).catch(result => {
                fail(result);
            })
    });
};
const get = (url: string, config?: any): Promise<AxiosResponse<any, any>> => {
    return new Promise((success, fail) => {
        axios.get(url, config).then(result => {
            if (result.status == 200)
                success(result)
            else {
                fail(result);
            }
        }).catch(result => {
            fail(result);
        })
    });
}

export {
    get as get,
    post as post,
};