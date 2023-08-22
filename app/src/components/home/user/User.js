import styles from "./user.module.css";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../../context/authContext";

import Process from "./process/Process";
import Todo from "./todo/Todo";
import Done from "./done/Done";

import * as taskService from "../../../services/taskService";
import { Create } from "./Create";

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
  const [sliders, setSliders] = useState({
    option: false,
    num: 0,
  });

  useEffect(() => {
    taskService
      .getUserTasks(localStorage.getItem("sessionStorage"), user?._id)
      .then((res) => {
        if (!res.message) {
          setTasks(res);
        } else {
          console.log(res);
        }
      });
  }, []);

  console.log(sliders);

  useEffect(() => {
    if (currentTask?._id != undefined) {
      taskService
        .getCurrentTask(currentTask._id, localStorage.getItem("sessionStorage"))
        .then((res) => {
          setCurrentTask(res);
          // setSelectedValue(res.mainTitle)
        });
    } else {
      setSelectedValue("disabledOption");
    }
  }, [currentTask?._id]);

  const onSelectChangeHandler = (e) => {
    let taskId = e.target.value;

    taskService
      .getCurrentTask(taskId, localStorage.getItem("sessionStorage"))
      .then((res) => {
        if (!res.message) {
          setCurrentTask(res);
          setSelectedValue(res?._id);
        } else {
          console.log(res);
        }
      });
  };

  return (
    <div className={styles.mainCont}>
      {!create.option && (
        <>
          {tasks.length > 0 ? (
            <select
              className={styles.selectTasks}
              value={selectedValue}
              onChange={(e) => onSelectChangeHandler(e)}
            >
              <option value="disabledOption" disabled>
                Choose an option
              </option>
              {tasks.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.mainTitle}
                </option>
              ))}
            </select>
          ) : (
            <h2 className={styles.h2Header}>You don't have any task yet!</h2>
          )}
        </>
      )}

      {!create.option && (
        <div className={styles.container}>
          <Todo
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            sliders={sliders}
          />

          <hr className={styles.line} />

          <Process
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            sliders={sliders}
          />

          <hr className={styles.line} />

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

      <Create
        tasks={tasks}
        create={create}
        setCreate={setCreate}
        setTasks={setTasks}
        setCurrentTask={setCurrentTask}
        currentTask={currentTask}
      />
    </div>
  );
};

export default User;
