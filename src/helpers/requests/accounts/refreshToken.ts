import axios from "@/axios";


export default async function RefreshToken() {
    try {
        return await axios.post('/accounts/token/refresh/',
            {}, {withCredentials: true});
    } catch (err) {
        return err;
    }
}
