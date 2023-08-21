import styles from "./user.module.css";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/authContext";

import Process from "./process/Process";
import Todo from "./todo/Todo";
import Done from "./done/Done";

import * as taskService from "../../../services/taskService";
import { Create } from "./Create";

const User = () => {
  const { user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(undefined)
  const [create, setCreate] = useState({
    option: false,
    value: "",
    mode: ''
  });

  useEffect(() => {
    taskService
      .getUserTasks(localStorage.getItem("sessionStorage"), user?._id)
      .then((res) => {
        if (!res.message) {
          setTasks(res);
        //   setCurrentTask(res[res.length - 1])
        } else {
          console.log(res);
        }
      });
  }, []);

  useEffect(() => {
    if(currentTask != undefined) {
        taskService.getCurrentTask(currentTask._id, localStorage.getItem('sessionStorage'))
            .then(res => setCurrentTask(res))
    }
  }, [currentTask?._id])

  const onSelectChangeHandler = (e) => {
    let taskId = e.target.value

    if(currentTask?._id != taskId) {
        taskService.getCurrentTask(taskId, localStorage.getItem('sessionStorage'))
            .then(res => {
                if(!res.message) {
                    setCurrentTask(res)
                } else {
                    console.log(res)
                }
            })
    }
  }

  return (
    <div className={styles.mainCont}>
      {!create.option && (
        <>
          {tasks.length > 0 ? (
            <select className={styles.selectTasks} onChange={(e) => onSelectChangeHandler(e)}>
              {tasks.map((x) => (
                <option key={x._id} value={x._id}>{x.mainTitle}</option>
              ))}
            </select>
          ) : (
            <h2 className={styles.h2Header}>You don't have any task yet!</h2>
          )}
        </>
      )}

      {!create.option && (
        <div className={styles.container}>
          <Todo currentTask={currentTask} setCurrentTask={setCurrentTask} />

          <hr className={styles.line} />

          <Process currentTask={currentTask} setCurrentTask={setCurrentTask} />

          <hr className={styles.line} />

          <Done currentTask={currentTask} setCurrentTask={setCurrentTask} />

          <div className={styles.sliders}>
            <button className={styles.arrowBtn}>&#8810;</button>
            <button className={styles.arrowBtn}>&#8811;</button>
          </div>
        </div>
      )}

      <Create tasks={tasks} create={create} setCreate={setCreate} setTasks={setTasks} setCurrentTask={setCurrentTask} currentTask={currentTask} />
    </div>
  );
};

export default User;
