import axios from "@/axios";

export default function loginUser(email: string, password: string) {
    return axios.post('/auth/token', {
        email: email,
        password: password
    }, { withCredentials: true })
        .then(r => {
            return r;
        });
}
