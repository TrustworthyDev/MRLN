import axios from "@/axios";
import { User } from "@/types/User";
import { Article } from "@/types/Article";


/*
* Fetches all users with a UserGroup of Editor
* */
async function GetAllEditors() {
    try {
        return await axios.get('/accounts/all-editors/', { withCredentials: true });
    } catch (e) {
        return e;
    }
}


/*
* Bulk assigns Articles to a user
* Takes a User object, and an array of Articles
* */
async function AssignEditorArticles(user: User, allArticles: Array<Article>) {
    try {
        const allArticleIds: number[] = [];
        allArticles.forEach(x => {
            allArticleIds.push(x.id);
        });

        return await axios.post('/articles/assign-articles/', {
            user_id: user.id,
            article_ids: allArticleIds
        });
    } catch (e) {
        return e;
    }
}

async function GetEditorInformation(userId: number) {
    try {
        return await axios.post('/accounts/get-editor-information/', {
            user_id: userId
        }, { withCredentials: true });
    } catch (e) {
        return e;
    }
}

export {
    GetAllEditors,
    AssignEditorArticles,
    GetEditorInformation
}
