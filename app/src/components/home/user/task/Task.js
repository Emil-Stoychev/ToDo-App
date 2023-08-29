import styles from "./task.module.css";

import * as taskService from "../../../../services/taskService";
import { useState } from "react";
import { TaskInfo } from "./TaskInfo";
import { TaskDiv } from "./TaskDiv";

export const Task = ({ x, currentTask, setCurrentTask }) => {
  const [edit, setEdit] = useState({
    option: false,
    value: "",
  });
  const [taskInfo, setTaskInfo] = useState(false);

  const onEditHandler = () => {
    if (edit.value.trim() != "" && edit.value.length > 3) {
      taskService
        .editTask(x._id, edit.value, localStorage.getItem("sessionStorage"))
        .then((res) => {
          if (!res.message) {
            x.title = edit.value;

            setEdit({ option: false, value: "" });
          } else {
            console.log(res);
          }
        });
    }
  };

  const onDeleteHandler = (taskId) => {
    taskService
      .deleteTask(
        taskId,
        currentTask?._id,
        localStorage.getItem("sessionStorage")
      )
      .then((res) => {
        if (!res.message) {
          setCurrentTask((state) => ({
            ...state,
            todo: state.todo.filter((x) => {
              if (x?._id != taskId) {
                return x;
              }
            }),
          }));
        } else {
          console.log(res);
        }
      });
  };

  const onMoveHandler = (num) => {
    taskService
      .moveTask(
        x._id,
        currentTask?._id,
        num,
        localStorage.getItem("sessionStorage")
      )
      .then((res) => {
        if (!res.message) {
          setCurrentTask(res);
        } else {
          console.log(res);
        }
      });
  };

  const changePriority = (taskId) => {
    if (x?.in != "done") {
      taskService
        .changePriority(taskId, localStorage.getItem("sessionStorage"))
        .then((res) => {
          if (!res.message) {
            if (x?.in == "todo") {
              setCurrentTask((state) => ({
                ...state,
                todo: state.todo.map((y) => {
                  if (y?._id == taskId) {
                    y.priority = res;
                  }

                  return y;
                }),
              }));
            } else if (x?.in == "inProgress") {
              setCurrentTask((state) => ({
                ...state,
                inProgress: state.inProgress.map((y) => {
                  if (y?._id == taskId) {
                    y.priority = res;
                  }

                  return y;
                }),
              }));
            }
          } else {
            console.log(res);
          }
        });
    }
  };

  return (
    <>
      <div className={styles.task}>
        {taskInfo ? (
          <TaskInfo x={x} taskInfo={taskInfo} setTaskInfo={setTaskInfo} />
        ) : (
          <TaskDiv
          x={x}
          setTaskInfo={setTaskInfo}
          onEditHandler={onEditHandler}
          onDeleteHandler={onDeleteHandler}
          onMoveHandler={onMoveHandler}
          changePriority={changePriority}
          edit={edit}
          setEdit={setEdit}
          currentTask={currentTask}
          />
        )}
      </div>
    </>
  );
};
