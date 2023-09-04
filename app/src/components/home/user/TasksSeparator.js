import Process from "./process/Process";
import Todo from "./todo/Todo";
import Done from "./done/Done";

export const TasksSeparator = ({ currentTask, setCurrentTask, sliders }) => {

    return (
        <>
            {sliders.option
                ?
                sliders.num == 0 &&
                <Todo
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
                :
                <Todo
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
            }

            {sliders.option
                ?
                sliders.num == 1 &&
                <Process
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
                :
                <Process
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
            }

            {sliders.option
                ?
                sliders.num == 2 &&
                <Done
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
                :
                <Done
                    currentTask={currentTask}
                    setCurrentTask={setCurrentTask}
                />
            }
        </>
    )
}