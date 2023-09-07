import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import stylesEmployees from './employees.module.css'
import styles from '../user.module.css'

import * as authService from "../../../../services/authService";
import * as taskService from "../../../../services/taskService";
import { OnlineUsersContext } from '../../../../context/onlineUsersContext';

export const Employees = ({ user, addUser, setAddUser, setCurrentTask, currentTask, setCreate }) => {
    const [users, setUsers] = useState([])
    const [defaultUsers, setDefaultUsers] = useState([])
    const navigate = useNavigate()
    const {onlineUsers, socket} = useContext(OnlineUsersContext)

    useEffect(() => {
        if (addUser.mode != 'non') {
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
        } else {
            if (addUser.value.trim() != '') {
                setUsers(defaultUsers.filter(x => {
                    if (x.username.includes(addUser.value)) {
                        return x
                    }
                }))
            } else {
                setUsers(defaultUsers)
            }
        }
    }, [addUser.value])

    const addUserToProject = (userId) => {
        taskService.addOrRemoveUserToProject(userId, currentTask?._id, localStorage.getItem('sessionStorage'))
            .then(res => {
                if (!res.message) {
                    setCurrentTask(state => ({
                        ...state,
                        admins: res.option ? state.admins.filter(x => x?._id != userId) : state.admins,
                        employees: res.option
                            ? state.employees.filter(x => x?._id != userId)
                            : [...state.employees, { _id: userId, email: res?.email, image: res?.image, username: res?.username }]
                    }))

                    socket.current?.emit("add-or-remove-user-from-project", {
                        userId,
                        mainTaskId: currentTask?._id,
                        perpetrator: user?._id,
                        res,
                        currentTask,
                        users: currentTask?.employees?.map((x) => {
                            if (onlineUsers.find((y) => y?._id == x?._id)) return x?._id;
                        }),
                    });
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

    useEffect(() => {
        if (addUser.option) {
            setDefaultUsers([...currentTask?.employees])
            setUsers([...currentTask?.employees])
        }
    }, [addUser])

    const addOrRemoveAdmin = (userId) => {
        taskService.addOrRemoveAdmin(userId, currentTask?._id, localStorage.getItem('sessionStorage'))
            .then(res => {
                if (!res.message) {
                    setCurrentTask(state => ({
                        ...state,
                        admins: res.option == 'add' ? [...state.admins, { email: res.email, image: res.image, username: res.username, _id: res._id }] : state.admins.filter(x => x?._id != res?._id)
                    }))

                    socket.current?.emit("add-or-remove-admin", {
                        userId,
                        mainTaskId: currentTask?._id,
                        perpetrator: user?._id,
                        res,
                        currentTask,
                        users: currentTask?.employees?.map((x) => {
                            if (onlineUsers.find((y) => y?._id == x?._id)) return x?._id;
                        }),
                    });
                } else {
                    console.log(res);
                }
            })
    }

    return (
        <>
            {addUser.option
                ?
                <div className={stylesEmployees.mainDiv}>
                    <div key={currentTask?.author?._id} className={stylesEmployees.userTemplate}>
                        <div className={stylesEmployees.userTamplateTop}>
                            <svg className={stylesEmployees.userRole} fill='orange' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" /></svg>
                            <img src={currentTask?.author?.image} className={onlineUsers?.find(x => x._id == currentTask?.author?._id) ? styles.profileImageOn : styles.profileImageOff} />
                            <h2>{currentTask?.author?.username} {currentTask?.author?._id == user?._id && '(you)'} <span className={stylesEmployees.adminSpan}>Creator</span></h2>
                        </div>

                        <div className={stylesEmployees.smallBtnsDiv}>
                            <button onClick={() => navigate(`/profile/${currentTask?.author?._id}`)} className={stylesEmployees.smallBtns}>View</button>
                        </div>
                    </div>

                    <br />

                    <input className={stylesEmployees.searchInput} type='search' placeholder='Search' value={addUser.value} onChange={(e) => onChangeHandler(e)} />

                    <div className={stylesEmployees.usersRendering}>
                        {users?.map(x =>
                            <div key={x?._id} className={stylesEmployees.userTemplate}>
                                <div className={stylesEmployees.userTamplateTop}>
                                    {currentTask?.author?._id != x?._id && currentTask?.employees.some(y => y?._id == x?._id) && <svg className={stylesEmployees.userRole} fill='orange' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M413.5 237.5c-28.2 4.8-58.2-3.6-80-25.4l-38.1-38.1C280.4 159 272 138.8 272 117.6V105.5L192.3 62c-5.3-2.9-8.6-8.6-8.3-14.7s3.9-11.5 9.5-14l47.2-21C259.1 4.2 279 0 299.2 0h18.1c36.7 0 72 14 98.7 39.1l44.6 42c24.2 22.8 33.2 55.7 26.6 86L503 183l8-8c9.4-9.4 24.6-9.4 33.9 0l24 24c9.4 9.4 9.4 24.6 0 33.9l-88 88c-9.4 9.4-24.6 9.4-33.9 0l-24-24c-9.4-9.4-9.4-24.6 0-33.9l8-8-17.5-17.5zM27.4 377.1L260.9 182.6c3.5 4.9 7.5 9.6 11.8 14l38.1 38.1c6 6 12.4 11.2 19.2 15.7L134.9 484.6c-14.5 17.4-36 27.4-58.6 27.4C34.1 512 0 477.8 0 435.7c0-22.6 10.1-44.1 27.4-58.6z" /></svg>}
                                    {currentTask?.author?._id == x?._id && <svg className={stylesEmployees.userRole} fill='orange' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" /></svg>}
                                    <img src={x?.image} className={onlineUsers?.find(y => y._id == x?._id) ? styles.profileImageOn : styles.profileImageOff} />
                                    <h2>{x?.username} {x?._id == user?._id && '(you)'} {currentTask?.author?._id == x?._id && <span className={stylesEmployees.adminSpan}>Creator</span>}</h2>
                                    {currentTask?.author?._id != x?._id && <h2><span className={stylesEmployees.adminSpan}>{currentTask?.admins?.some(y => y._id == x?._id) && 'Admin'}</span></h2>}
                                </div>

                                <div className={stylesEmployees.smallBtnsDiv}>
                                    {currentTask?.employees.find(y => y?._id == x?._id) ? currentTask?.author?._id != user?._id || currentTask?.admins.some(y => y?._id == user?._id) && x?._id != user?._id && <button onClick={() => addOrRemoveAdmin(x?._id)} className={stylesEmployees.smallBtns}>{currentTask?.admins?.some(y => y._id == x?._id) ? 'Remove admin' : 'Make admin'}</button> : ''}
                                    <button onClick={() => navigate(`/profile/${x?._id}`)} className={stylesEmployees.smallBtns}>View</button>
                                    {currentTask?.author?._id != x?._id && currentTask?.admins.some(y => y?._id == user?._id) && <button onClick={() => addUserToProject(x?._id)} className={stylesEmployees.smallBtns}>{currentTask?.employees?.some(y => y._id == x?._id) ? 'Remove' : 'Add to project'}</button>}
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

                        <div className={styles.people} onClick={() => setAddUser({ option: true, value: '' })}>
                            {currentTask?._id && <img src={currentTask?.author?.image} className={onlineUsers?.find(x => x._id == currentTask?.author?._id) ? styles.profileImageOn : styles.profileImageOff} />}
                            {currentTask?.employees?.slice(0, 3)?.map(y => <img key={y?._id} src={y?.image} className={onlineUsers?.find(x => x._id == y?._id) ? styles.profileImageOn : styles.profileImageOff} />)}
                            {currentTask?.employees?.length > 3 && <button className={styles.numOfPeople}>+{currentTask?.employees?.length - 3}</button>}
                        </div>
                    </div>

                    <button className={styles.addNewMainTaskBtn} onClick={() => setCreate({ option: true, value: "", mode: "main" })} > <svg fill="white" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg> </button>
                </div>
            }
        </>
    )
}