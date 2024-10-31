import React, { useEffect, useState } from "react";
import { UserRoundPlus, LogIn } from 'lucide-react';

const List = () => {
    const [userName, setUserName] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [listTask, setListTask] = useState([]);
    const [messageError, setMessageError] = useState('Enter some task');
    const [showError, setShowError] = useState(false)

    // Capture input from username
    const handleUserName = e => {
        setUserName(e.target.value);
    }

    // Create username and message error
    const postUserName = () => {
        fetch(`https://playground.4geeks.com/todo/users/${userName}`, { method: 'POST' })
            .then(resp => {
                resp.json();
                if (resp.status === 400) {
                    setMessageError('Username already exists');
                    setShowError(true);
                }
            })
            .catch(error => console.error(error))
    }

    // Click and create username
    const handleKeyDownUserName = e => {
        if (e.key === 'Enter') {
            postUserName();
        }
    }

    // Capture task
    const handleInputChange = e => {
        setInputValue(e.target.value);
    }

    // Create task
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            setListTask(prev => [...prev, inputValue]);
            setInputValue(e.target.value = '');
            setShowError(false);
        }
    }
	
    // Hidden Error
    const hiddenMenssageError = () => setShowError(false);
    
    return (
		<div className='bg-info bg-opacity-10 border border-info rounded p-5'>
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
                            onChange={(e) => {
                                handleUserName(e);
                                hiddenMenssageError();
                            }}
                            onKeyDown={handleKeyDownUserName}
                            onClick={hiddenMenssageError}
                            placeholder="Create new username"
                        />
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                        <input 
                            type="text" 
                            className="form-control border-light bg-transparent mb-3"
                            onChange={(e) => {
                                handleUserName(e);
                                hiddenMenssageError();
                            }}
                            onKeyDown={handleKeyDownUserName}
                            onClick={hiddenMenssageError}
                            placeholder="View task from username"
                        />
                    </div>
                </div>

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
            {showError && <div className="message-error text-danger">{messageError}</div>}
            <div className="show-task mt-4">
                <ul className="list-task">
                    {listTask.map((task, index)=> (
                        <li key={index} className="task-item">
                            <span>🍃</span> {task}
                            <button className="btn btn-danger" onClick={() => {
                                const newArr = listTask.filter(taskOut => taskOut != task);
                                setListTask(newArr);
                            }}>X</button>
                        </li>
                    ))}
                    {listTask.length === 0 ? <span style={{color: 'grey'}}>No tasks, add tasks</span> : ''}
                </ul>
                <span className="item-task">Tasks: {listTask.length}</span>
            </div>
		</div>
	);
};

export default List;