import React, {useEffect, useState} from "react";
import axios from "axios";
import useCategories from "../../custom/useCategories";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [catId, setCatId] = useState(null);
    const [orderBy, setOrderBy] = useState(null);

    useEffect(() => {
        if(!categories.length){
            fetchCategories();
        }
        if(!tasks.length){
            fetchTasks();
        }
    }, [page, catId, orderBy]);

    const fetchTasks = async ()  => {
        try {
            if(catId){
                const response = await axios.get(`/api/category/${catId}/tasks?page=${page}`);
                setTasks(response.data);
            }else if(orderBy){
                const response = await axios.get(`/api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
                setTasks(response.data);
            }else{
                const response = await axios.get(`/api/tasks?page=${page}`);
                setTasks(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPrevNextTasks = (link) => {
        const url = new URL(link);
        setPage(parseInt(url.searchParams.get('page')));
    }

    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        console.log('hi'+fetchedCategories);
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
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Filter by category</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="category"
                                onChange={()=>{
                                    setPage(1);
                                    setCatId(null);
                                }}  checked={!catId ? true : false} />
                            <label htmlFor="category" className="form-check-label">All</label>
                        </div>
                        {
                            categories?.map(category => (
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" name="category"
                                           onChange={() => {
                                               setPage(1);
                                               setCatId(event.target.value);
                                           }}
                                           value={category.id}
                                           id={category.id}
                                    />
                                    <label htmlFor={category.id} className="form-check-label">
                                        {category.name}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">
                            Order by
                        </h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <h6>ID</h6>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="id"
                                       value="asc"
                                       onChange={(event)=>{
                                           setPage(1);
                                           setCatId(null);
                                            setOrderBy({
                                                column: 'id',
                                                direction: event.target.value
                                            });
                                       }} checked={!catId ? true : false} />
                                <label htmlFor="id" className="form-check-label">
                                    <i className="fas fa-arrow-up"></i>
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className="form-check-input" name="id"
                                       value="desc"
                                       onChange={(event)=>{
                                           setPage(1);
                                           setCatId(null);
                                           setOrderBy({
                                               column: 'id',
                                               direction: event.target.value
                                           });
                                       }}  />
                                <label htmlFor="id" className="form-check-label">
                                    <i className="fas fa-arrow-down"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

