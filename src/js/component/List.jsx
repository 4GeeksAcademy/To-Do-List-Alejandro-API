import React, { useEffect, useState } from "react";
import { UserRoundPlus, LogIn, CircleX } from 'lucide-react';

const List = () => {
    const [userName, setUserName] = useState('');
    const [accessUserName, setAccessUserName] = useState(userName);
    const [inputValue, setInputValue] = useState('');
    const [listTask, setListTask] = useState([]);
    const [newListTask, setNewListTask] = useState({ label: '' });
    const [messageError, setMessageError] = useState('Enter some task');
    const [showError, setShowError] = useState(false);
    const [messagesuccessful, setMessagesuccessful] = useState('User create successful');
    const [showSuccessful, setShowSuccessful] = useState(false);
    const [ almacenaruser, setAlmacenarUser ] = useState([]);

    // API Get all user
    const getAllUser = () => {
        fetch('https://playground.4geeks.com/todo/users')
            .then(resp => resp.json())
            .then(data => setAlmacenarUser(data.users))
            .catch(error => console.error(error));
    }

    // API Create username and message error
    const createUser = () => {
        fetch(`https://playground.4geeks.com/todo/users/${userName}`, { method: 'POST' })
            .then(resp => {
                resp.json();
                if (resp.status === 400) {
                    setMessageError('Username already exists');
                    setShowError(true);
                }
                if (resp.ok) {
                    setShowSuccessful(true);
                    setInterval(() => setShowSuccessful(false), 3000);
                }
                getAllUser();
                setAccessUserName(userName);
            })
            .catch(error => console.error(error))
    };

    // API Access username and show task from Username
    const fetchUserTasks = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${accessUserName}`);

            if (response.status === 404) {
                setMessageError("Username doesn't exist");
                setShowError(true);
                return;
            }

            const data = await response.json();
            setListTask(data.todos || []);
        } catch (error) {
            console.error(error);
        }
    };

    // API Create Task from UserName
    const createTask = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${accessUserName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newListTask)
            });
            await response.json();

            fetchUserTasks();
        } catch (error) {
            console.error(error);
        }
    }

    // API Delete Task
    const deleteTask = async id_task => {
        try {
            await fetch(`https://playground.4geeks.com/todo/todos/${id_task}`, { method: "DELETE", redirect: "follow" });
            fetchUserTasks();
        } catch (error) {
            console.error(error);
        }
    };

    // Capture input from username
    const handleUserName = e => setUserName(e.target.value);

    // Click and create username
    const handleKeyDownUserName = e => {
        if (e.key === 'Enter') {
            createUser();
        }
    };

    // Capture task
    const handleInputChange = e => {
        const value = e.target.value;
        setInputValue(value);
        setNewListTask(prev => ({
            ...prev,
            label: value
        }));
    };

    // Create task
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            createTask();
            setInputValue(e.target.value = '');
            setShowError(false);
        }
    };

    // Capture Access User name
    const handleAccessUserName = e => setAccessUserName(e.target.value);

    // Hidden Error
    const hiddenMenssageError = () => setShowError(false);

    // Get all user
    useEffect(() => getAllUser(), []);

    useEffect(() => {
        if (accessUserName) {
            fetchUserTasks();
        }
    }, [accessUserName]);

    return (
		<div className='show-task bg-info bg-opacity-10 border border-info rounded p-5'>
            <div>
                <h1 className="text-center">Task</h1>

                <ul className="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"><UserRoundPlus /></button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><LogIn /></button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        <input
                            type="text"
                            className="form-control border-light bg-transparent mb-3"
                            onChange={e => {
                                handleUserName(e);
                                hiddenMenssageError();
                            }}
                            onKeyDown={handleKeyDownUserName}
                            onClick={hiddenMenssageError}
                            placeholder="Create new username"
                        />
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <select 
                            className="form-select border-light bg-transparent mb-3" 
                            onChange={handleAccessUserName}
                            value={accessUserName}
                        >
                            <option value='' disabled>Select User Name</option>
                            {almacenaruser.map(user => {
                                return (<option key={user.id} value={user.name}>{user.name}</option>)
                            })}
                        </select>

                        <input
                            type="text"
                            id="task"
                            className="form-control border-light bg-transparent"
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onClick={hiddenMenssageError}
                            placeholder="Add a New Task"
                        />
                    </div>
                </div>

            </div>
            {showError && <div className="message-error text-danger">{messageError}</div>}
            {showSuccessful && <div className="message-successful">{messagesuccessful}</div>}
            <div className="mt-4">
                <ul className="list-task">
                    {listTask && listTask.length > 0 ? (
                        listTask.map(task => (
                            <li key={task.id} className="task-item">
                                {task.label}
                                <button className="btn btn-danger" onClick={() => {
                                    deleteTask(task.id);
                                    fetchUserTasks();
                                    }}><CircleX /></button>
                            </li>
                        ))
                    ) : (
                        <span className="aling-center" style={{ color: 'gray' }}>{accessUserName ? accessUserName : 'User'} has no tasks, add tasks</span>
                    )}
                </ul>
                <span className="item-task">Tasks: {listTask.length}</span>
            </div>
		</div>
	);
};

export default List;