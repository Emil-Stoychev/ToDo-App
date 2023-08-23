import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import stylesEmployees from './employees.module.css'
import styles from '../user.module.css'

import * as authService from "../../../../services/authService";
import * as taskService from "../../../../services/taskService";

export const Employees = ({ addUser, setAddUser, setCurrentTask, currentTask, setCreate }) => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (addUser.value.trim() != '') {
            authService.getUserByUsername(localStorage.getItem('sessionStorage'), addUser.value)
                .then(res => {
                    if (!res.message) {
                        setUsers(res)
                    } else {
                        console.log(res);
                    }
                })
        } else {
            if (addUser.value == '') {
                setUsers([])
            }
        }
    }, [addUser.value])

    const addUserToProject = (userId) => {
        taskService.addOrRemoveUserToProject(userId, currentTask?._id, localStorage.getItem('sessionStorage'))
            .then(res => {
                if (!res.message) {
                    setCurrentTask(state => ({
                        ...state,
                        employees: res.option == true
                            ? state.employees.filter(x => x?._id != userId)
                            : [...state.employees, { _id: userId, email: res?.email, image: res?.image }]
                    }))
                } else {
                    console.log(res);
                }
            })
    }

    const onChangeHandler = (e) => {
        setAddUser(state => ({
            ...state,
            value: e.target.value
        }))
    }

    return (
        <>
            {addUser.option
                ?
                <div className={stylesEmployees.mainDiv}>
                    <input className={stylesEmployees.searchInput} type='search' placeholder='Search' value={addUser.value} onChange={(e) => onChangeHandler(e)} />

                    <div className={stylesEmployees.usersRendering}>
                        {users?.map(x =>
                            <div key={x?._id} className={stylesEmployees.userTemplate}>
                                <div className={stylesEmployees.userTamplateTop}>
                                    <img src={x?.image} />
                                    <h2>{x?.username}</h2>
                                </div>

                                <div className={stylesEmployees.smallBtnsDiv}>
                                    <button onClick={() => navigate(`/profile/${x?._id}`)} className={stylesEmployees.smallBtns}>View</button>
                                    <button onClick={() => addUserToProject(x?._id)} className={stylesEmployees.smallBtns}>{currentTask?.employees?.some(y => y._id == x?._id) ? 'Remove' : 'Add to project'}</button>
                                </div>
                            </div>
                        )}

                        {users?.length == 0 && <h2 className={stylesEmployees.usersNotFound}>No users found!</h2>}

                    </div>

                    <button onClick={() => setAddUser({ option: false, value: '' })} className={stylesEmployees.primaryBtn}>Back</button>
                </div>
                :
                <div className={styles.cntDivBtns}>
                    <div className={styles.divButtons}>
                        <button disabled={currentTask?._id == undefined} onClick={() => setAddUser({ option: true, value: '' })}><svg fill="white" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg></button>

                        <div className={styles.people}>
                            {currentTask?._id && <img src={currentTask?.author?.image} />}
                            {currentTask?.employees?.slice(0, 3)?.map(y => <img key={y?._id} src={y?.image} />)}
                            {currentTask?.employees?.length > 3 && <button className={styles.numOfPeople}>+{currentTask?.employees?.length - 3}</button>}
                        </div>
                    </div>

                    <button className={styles.addNewMainTaskBtn} onClick={() => setCreate({ option: true, value: "", mode: "main" })} > <svg fill="white" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg> </button>
                </div>
            }
        </>
    )
}