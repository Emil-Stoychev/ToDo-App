import { useState } from "react";
import styles from "./user.module.css";

import * as taskService from '../../../services/taskService'

export const DeleteMain = ({ currentTask, setCurrentTask, setTasks }) => {
  const [del, setDel] = useState(false);

  const onDeleteHandler = () => {
    taskService.deleteMainTask(currentTask._id, localStorage.getItem('sessionStorage'))
        .then(res => {
            if(!res.message) {
                setTasks(state => state.filter(x => x._id != currentTask._id))
                setCurrentTask(undefined)
            } else {
                console.log(res);
            }
        })
  };

  return (
    <>
      {del ? (
        <>
          <button
            className={styles.dangerBtn}
            onClick={() => onDeleteHandler()}
          >
            Yes
          </button>
          <button className={styles.primaryBtn} onClick={() => setDel(false)}>
            No
          </button>
        </>
      ) : (
        <button className={styles.dangerBtn} onClick={() => setDel(true)}>
          Delete
        </button>
      )}
    </>
  );
};
