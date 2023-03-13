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

    const checkIfTaskIsDone = (done) => (
        done ? (
            <span className="badge bg-success">
                Done
            </span>
        ) :
        (
            <span className="badge bg-danger">
                Processing...
            </span>
        )
    )

    return (
        <div className="row my-5">
            <div className="col-md-9">
                <div className="card bg-white">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Done</th>
                                <th>Category</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tasks.data?.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.body}</td>
                                        <td>{checkIfTaskIsDone(task.done)}</td>
                                        <td>{task.category.name}</td>
                                        <td>{task.created_at}</td>
                                        <td></td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

