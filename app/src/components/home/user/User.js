import styles from "./user.module.css";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../../context/authContext";

import Process from "./process/Process";
import Todo from "./todo/Todo";
import Done from "./done/Done";

import * as taskService from "../../../services/taskService";
import { Create } from "./create/Create";
import { Employees } from "./employees/Employees";
import { SelectComponent } from "./select/SelectComponent";

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

  return (
    <div className={styles.mainCont}>
      {!addUser.option && !create.option && <SelectComponent tasks={tasks} selectedValue={selectedValue} setSelectedValue={setSelectedValue} setCurrentTask={setCurrentTask} />}

      {!create.option && <Employees user={user} addUser={addUser} setAddUser={setAddUser} setCurrentTask={setCurrentTask} currentTask={currentTask} setCreate={setCreate} />}

      {!addUser.option && !create.option && (
        <div className={styles.container}>
          <Todo
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            sliders={sliders}
          />

          <Process
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            sliders={sliders}
          />

          <Done
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            sliders={sliders}
          />

          <div className={styles.sliders}>
            <button className={styles.arrowBtn}>&#8810;</button>
            <button className={styles.arrowBtn}>&#8811;</button>
          </div>
        </div>
      )}

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
