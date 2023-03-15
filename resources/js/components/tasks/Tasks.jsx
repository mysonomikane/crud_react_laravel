import React, {useEffect, useState} from "react";
import axios from "axios";
import useCategories from "../../custom/useCategories";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if(!categories.length){
            fetchCategories();
        }
        if(!tasks.length){
            fetchTasks();
        }
    }, [page]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks?page=${page}`);
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPrevNextTasks = (link) => {
        const url = new URL(link);
        setPage(url.searchParams.get('page'));
    }

    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        setCategories(fetchedCategories);
    }

    const renderPagination = () => (
        <ul className="pagination">
            {
                tasks.links?.map((link, index) => (
                    <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                        <a href="#"
                           style={{cursor: 'pointer'}}
                           onClick={() => fetchPrevNextTasks(link.url)}
                           className="page-link">
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </a>
                    </li>
                ))
            }
        </ul>
    )

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
                        <div className="my-4 d-flex justify-content-between">
                            <div>
                                Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} results.
                            </div>
                            <div>
                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

