import styles from "./user.module.css";

import * as taskService from "../../../services/taskService";

export const Create = ({
  tasks,
  create,
  setCreate,
  setTasks,
  setCurrentTask,
  currentTask,
}) => {
  const onCreateHandler = (e) => {
    e.preventDefault();

    if (create.value.trim() != "" && create.value.length > 3) {
      let data = {
        value: create.value,
        token: localStorage.getItem("sessionStorage"),
      };

      if (create.mode == "main") {
        taskService.createNewMain(data).then((res) => {
          if (!res.message) {
            setTasks((state) => [...state, res]);
            setCurrentTask(res);
            setCreate({ option: false, value: "", mode: "" });
          } else {
            console.log(res);
          }
        });
      } else if (create.mode == "task") {
        data.taskId = currentTask._id;

        taskService.createTask(data).then((res) => {
          if (!res.message) {
            //   setTasks((state) => [...state, res]);
            setCurrentTask((state) => ({
              ...state,
              todo: [...state.todo, res],
            }));
            setCreate({ option: false, value: "", mode: "" });
          } else {
            console.log(res);
          }
        });
      }
    }
  };

  const onChangeHandler = (e) => {
    setCreate((state) => ({
      ...state,
      value: e.target.value,
    }));
  };

  const onCloseHandler = () => {
    setCreate({ option: false, value: "", mode: "" });
  };

  return (
    <>
      {create.option && (
        <form className={styles.createNone}>
          <div className={styles.divInputs}>
            <label htmlFor="title">
              {create.mode == "task" ? "Title" : "Main Title"}
            </label>
            <textarea
              id="title"
              value={create.value}
              onChange={(e) => onChangeHandler(e)}
            ></textarea>
          </div>

          <div className={styles.closeAndCreateBtns}>
            <button onClick={() => onCloseHandler()}>Close</button>
            <button onClick={(e) => onCreateHandler(e)}>Create</button>
          </div>
        </form>
      )}

      {!create.option && (
        <div className={styles.createBtns}>
          <button
            disabled={tasks.length < 1}
            className={styles.primaryBtn}
            onClick={() => setCreate({ option: true, value: "", mode: "task" })}
          >
            Add Task
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => setCreate({ option: true, value: "", mode: "main" })}
          >
            Create New
          </button>
        </div>
      )}
    </>
  );
};
