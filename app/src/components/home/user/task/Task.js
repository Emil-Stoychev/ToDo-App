import styles from "./task.module.css";

import * as taskService from "../../../../services/taskService";
import { useContext, useEffect, useState } from "react";
import { TaskInfo } from "./TaskInfo";
import { TaskDiv } from "./TaskDiv";
import { OnlineUsersContext } from "../../../../context/onlineUsersContext";
import { AuthContext } from "../../../../context/authContext";

export const Task = ({ x, currentTask, setCurrentTask }) => {
  const [edit, setEdit] = useState({
    option: false,
    value: "",
  });
  const [taskInfo, setTaskInfo] = useState(false);
  const { onlineUsers, socket } = useContext(OnlineUsersContext);
  const { user } = useContext(AuthContext);
  const [taskMethods, setTaskMethods] = useState({
    option: "",
  });

  const onEditHandler = () => {
    if (edit.value.trim() != "" && edit.value.length > 3) {
      taskService
        .editTask(x._id, edit.value, localStorage.getItem("sessionStorage"))
        .then((res) => {
          if (!res.message) {
            x.title = edit.value;

            socket.current?.emit("change-task-value", {
              value: edit.value,
              mainTaskAuthor: currentTask?.author?._id,
              mainTaskId: currentTask?._id,
              perpetrator: user?._id,
              taskId: x?._id,
              users: currentTask?.employees?.map((g) => {
                if (onlineUsers.find((y) => y?._id == g?._id)) return g?._id;
              }),
            });

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
            todo: state.todo.filter((y) => {
              if (y?._id != taskId) {
                return y;
              }
            }),
          }));

          socket.current?.emit("delete-task", {
            mainTaskAuthor: currentTask?.author?._id,
            mainTaskId: currentTask?._id,
            perpetrator: user?._id,
            taskId,
            users: currentTask?.employees?.map((g) => {
              if (onlineUsers.find((y) => y?._id == g?._id)) return g?._id;
            }),
          });
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

          socket.current?.emit("move-task", {
            mainTaskAuthor: currentTask?.author?._id,
            mainTaskId: currentTask?._id,
            perpetrator: user?._id,
            replacedTask: res,
            users: currentTask?.employees?.map((g) => {
              if (onlineUsers.find((y) => y?._id == g?._id)) return g?._id;
            }),
          });
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

          if(x?.in == 'todo' || x?.in == 'inProgress') {
            socket.current?.emit("change-task-priority", {
              taskIn: x?.in,
              priority: res,
              mainTaskAuthor: currentTask?.author?._id,
              mainTaskId: currentTask?._id,
              perpetrator: user?._id,
              taskId,
              users: currentTask?.employees?.map((g) => {
                if (onlineUsers.find((y) => y?._id == g?._id)) return g?._id;
              }),
            });
          }
        });
    }
  };

  socket.current?.on("after-delete-task", (data) => {
    if (data != undefined && currentTask?._id == data?.mainTaskId) {
      setTaskMethods({ option: "delete", res: data });
    }
  });

  socket.current?.on("after-change-task-priority", (data) => {
    if (data != undefined && currentTask?._id == data?.mainTaskId) {
      setTaskMethods({ option: "change", res: data });
    }
  });

  socket.current?.on("after-change-task-value", (data) => {
    if (data != undefined && currentTask?._id == data?.mainTaskId) {
      setTaskMethods({ option: "edit", res: data });
    }
  });

  socket.current?.on("after-move-task", (data) => {
    if (data != undefined && currentTask?._id == data?.mainTaskId) {
      setTaskMethods({ option: "move", res: data });
    }
  });

  useEffect(() => {
      if (taskMethods?.option == "delete") {
        setCurrentTask((state) => ({
          ...state,
          todo: state.todo.filter((x) => {
            if (x?._id != taskMethods?.res?.taskId) {
              return x;
            }
          }),
        }));
      } else if (taskMethods?.option == "edit") {
        setCurrentTask((state) => ({
          ...state,
          todo: state.todo.map((y) => {
            console.log(y);
            if (y?._id == taskMethods?.res?.taskId) {
              y.title = taskMethods?.res?.value;
            }

            return y;
          }),
        }));
      } else if (taskMethods?.option == "change") {
        if (x?.in == "todo") {
          setCurrentTask((state) => ({
            ...state,
            todo: state.todo.map((y) => {
              if (y?._id == taskMethods?.res?.taskId) {
                y.priority = taskMethods?.res?.priority;
              }

              return y;
            }),
          }));
        } else if (x?.in == "inProgress") {
          setCurrentTask((state) => ({
            ...state,
            inProgress: state.inProgress.map((y) => {
              if (y?._id == taskMethods?.res?.taskId) {
                y.priority = taskMethods?.res?.priority;
              }

              return y;
            }),
          }));
        }
      } else if (taskMethods?.option == "move") {
        setCurrentTask(taskMethods?.res?.replacedTask)
    }

    setTaskMethods({ option: "" });
  }, [taskMethods.option]);

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
