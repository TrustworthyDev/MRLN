import axios from "@/axios";

export default async function logoutUser() {
    try {
        return await axios.post('/auth/logout', {}, {
            withCredentials: true
        });
    } catch (err) {
        return err;
    }
}
