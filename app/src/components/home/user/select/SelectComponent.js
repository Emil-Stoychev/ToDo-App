import styles from '../user.module.css'

import * as taskService from '../../../../services/taskService'

export const SelectComponent = ({ tasks, selectedValue, setSelectedValue, setCurrentTask }) => {

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
        <div>
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

            <button className={styles.optionsBtn}><svg fill="white" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg></button>
        </div>
    )
}