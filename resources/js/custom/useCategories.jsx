import axios from "axios";

const useCategories = async () => {
    try {
        const response = await axios.get("/api/categories");
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

export default useCategories;
