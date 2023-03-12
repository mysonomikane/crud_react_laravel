import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>Home</div>
    )
}

