import { useContext, useState } from "react";
import styles from "../user.module.css";

import * as taskService from '../../../../services/taskService'
import { OnlineUsersContext } from "../../../../context/onlineUsersContext";
import { AuthContext } from "../../../../context/authContext";

export const DeleteMain = ({ currentTask, setCurrentTask, setTasks }) => {
  const [del, setDel] = useState(false);
  const { user } = useContext(AuthContext)
  const { onlineUsers, socket } = useContext(OnlineUsersContext)

  const onDeleteHandler = () => {
    taskService.deleteMainTask(currentTask._id, localStorage.getItem('sessionStorage'))
        .then(res => {
            if(!res.message) {
                setTasks(state => state.filter(x => x._id != currentTask._id))
                setCurrentTask(undefined)

                socket.current?.emit("delete-main-task", {
                  userId: user?._id,
                  mainTaskId: currentTask?._id,
                  users: currentTask?.employees?.map((x) => {
                    if (onlineUsers.find((y) => y?._id == x?._id)) return x?._id;
                  }),
                });
            } else {
                console.log(res);
            }
        })
  };

  return (
    <div className={styles.deleteMainTaskBtns}>
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
    </div>
  );
};
