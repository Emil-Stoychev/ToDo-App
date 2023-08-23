import styles from "../user.module.css";

import * as taskService from "../../../../services/taskService";
import { DeleteMain } from "../delete/DeleteMain";

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
            setCreate({ option: false, value: "", mode: "" });
            setCurrentTask(res);
          } else {
            console.log(res);
          }
        });
      } else {
        data.taskId = currentTask._id;

        taskService.createTask(data).then((res) => {
          if (!res.message) {
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
    } else {
      console.log('Something wrong!');
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
            <label htmlFor="title">Main Title</label>
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
          {currentTask != undefined && (
            <form className={styles.addNewTaskFrom}>
              <div className={styles.divInputsForTask}>
                <input
                  id="title"
                  value={create.value}
                  onChange={(e) => onChangeHandler(e)}
                  placeholder="Your task here..."
                />
              </div>

              <div className={styles.closeAndCreateBtns}>
                <button onClick={(e) => onCreateHandler(e)}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg></button>
              </div>
            </form>
          )}

          {currentTask != undefined && <DeleteMain currentTask={currentTask} setCurrentTask={setCurrentTask} setTasks={setTasks} />}
        </div>
      )}
    </>
  );
};
