import styles from "./user.module.css";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../../context/authContext";

import * as taskService from "../../../services/taskService";
import { Create } from "./create/Create";
import { Employees } from "./employees/Employees";
import { SelectComponent } from "./select/SelectComponent";
import { TasksSeparator } from "./TasksSeparator";
import { OnlineUsersContext } from "../../../context/onlineUsersContext";

const User = () => {
  const { user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(undefined);
  const [selectedValue, setSelectedValue] = useState("disabledOption");
  const [create, setCreate] = useState({
    option: false,
    value: "",
    mode: "",
  });
  const [addUser, setAddUser] = useState({
    option: false,
    value: ''
  })
  const [sliders, setSliders] = useState({
    option: false,
    num: 0,
  });
  const { socket } = useContext(OnlineUsersContext)


  useEffect(() => {
    taskService
      .getUserTasks(localStorage.getItem("sessionStorage"), user?._id)
      .then((res) => {
        if (!res.message) {
          console.log(res);
          setTasks(res);
        } else {
          console.log(res);
        }
      });
  }, []);

  // console.log(sliders);
  useEffect(() => {
    if (window.innerWidth > 980) {
      setSliders({ option: false, num: 0 })
    } else {
      setSliders(state => ({
        ...state,
        option: true
      }))
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) {
        setSliders({ option: false, num: 0 })
      } else {
        setSliders(state => ({
          ...state,
          option: true
        }))
      }
    })
  }, [])

  useEffect(() => {
    if (currentTask?._id != undefined) {
      taskService
        .getCurrentTask(currentTask._id, localStorage.getItem("sessionStorage"))
        .then((res) => {
          console.log(res);
          setCurrentTask(res);
          // setSelectedValue(res.mainTitle)
        });
    } else {
      setSelectedValue("disabledOption");
    }
  }, [currentTask?._id]);

  const onSlidersBtn = (n) => {
    if (n == 0) {
      if (sliders.num == 0) {
        setSliders(state => ({
          ...state,
          num: 2
        }))
      } else {
        setSliders(state => ({
          ...state,
          num: state.num - 1
        }))
      }
    } else {
      if (sliders.num == 2) {
        setSliders(state => ({
          ...state,
          num: 0
        }))
      } else {
        setSliders(state => ({
          ...state,
          num: state.num + 1
        }))
      }
    }
  }

  socket.current?.on("after-delete-main-task", (data) => {
    if (data != undefined && data?.mainTaskId == currentTask?._id && data?.userId != user?._id) {
      setCurrentTask(undefined);
      setTasks(state => state.filter(x => x._id != data?.mainTaskId))
    }
  });

  socket.current?.on("after-add-or-remove-user-from-project", (data) => {
    if (data != undefined && data?.userId != user?._id) {
      if(tasks.find(x => x._id == data?.mainTaskId)) {
        setTasks(state => state.filter(x => x._id != data?.mainTaskId))
      } else {
        setTasks(state => [...state, data?.res])
      }
    }
  });

  return (
    <div className={styles.mainCont}>
      {!addUser.option && !create.option && <SelectComponent tasks={tasks} selectedValue={selectedValue} setSelectedValue={setSelectedValue} setCurrentTask={setCurrentTask} />}

      {!create.option && <Employees user={user} addUser={addUser} setAddUser={setAddUser} setCurrentTask={setCurrentTask} currentTask={currentTask} setCreate={setCreate} />}

      {!addUser.option && !create.option && (
        <div className={styles.container}>
          <TasksSeparator currentTask={currentTask} setCurrentTask={setCurrentTask} sliders={sliders} />
        </div>
      )}

      {!addUser.option && !create.option && sliders.option &&
        <>
          <h2 className={styles.tasksHeader}>{sliders.num == 0 ? 'TODO' : sliders.num == 1 ? 'PROCESS' : 'DONE'} {sliders.num == 0 ? currentTask?.todo?.length : sliders.num == 1 ? currentTask?.inProgress?.length : currentTask?.done?.length}</h2>
          <div className={styles.sliders}>
            <button onClick={() => onSlidersBtn(0)} className={styles.arrowBtn}>&#8810;</button>
            <button onClick={() => onSlidersBtn(1)} className={styles.arrowBtn}>&#8811;</button>
          </div>
        </>
      }

      {!addUser.option &&
        <Create
          tasks={tasks}
          create={create}
          setCreate={setCreate}
          setTasks={setTasks}
          setCurrentTask={setCurrentTask}
          currentTask={currentTask}
          user={user}
        />}
    </div>
  );
};

export default User;
