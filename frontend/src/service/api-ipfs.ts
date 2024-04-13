import { ResponseType, TypeForm } from "../types";
import { get, post } from "./connection";
const API_KEY = "d3468a131ccd46fc7361"
const SECRET_API_KEY = "1f29feff35fee6da10262c14115bf9e748c2936bd6b2bb105514bb55e8036ef1"
const getUrl = (url: string) => "https://api.pinata.cloud/pinning/" + url


const uploadJSON = async (JSONBody: any): Promise<ResponseType<string>> => {

    try {
        const res = await post(getUrl("pinJSONToIPFS"), JSONBody, {
            headers: {
                pinata_api_key: API_KEY,
                pinata_secret_api_key: SECRET_API_KEY,
            }
        })
        return {
            success: true,
            data: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
        }
    } catch (error: any) {
        return {
            success: false,
            massage: error.massage
        }
    }

};

const uploadFile = async (file: File): Promise<ResponseType<string>> => {
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    try {
        const res = await post(getUrl("pinFileToIPFS"), data, {
            headers: {
                ["Content-Type"]: `multipart/form-data;`,
                pinata_api_key: API_KEY,
                pinata_secret_api_key: SECRET_API_KEY,
            }
        })
        return {
            success: true,
            data: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash
        }
    } catch (error: any) {
        return {
            success: false,
            massage: error.massage
        }
    }
};
interface User {
    id: number;
    firstName: string;
}
const getData = async (url: string): Promise<ResponseType<TypeForm<string>>> => {

    try {
        const res = await get(url)
        return {
            success: true,
            data: res.data
        }
    } catch (error: any) {
        return {
            success: false,
            massage: error.massage
        }
    }

};
export function IPFS() {
    return {
        uploadFile,
        uploadJSON,
        getData

    }
}
