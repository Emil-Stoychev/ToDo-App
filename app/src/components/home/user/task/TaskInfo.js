import styles from './task.module.css'

import * as taskService from "../../../../services/taskService";
import { format } from "timeago.js";

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/authContext';
import { OnlineUsersContext } from '../../../../context/onlineUsersContext';

export const TaskInfo = ({ x, taskInfo, setTaskInfo }) => {
  const { user, setUser } = useContext(AuthContext);
    const [history, setHistory] = useState({
        option: false,
        cont: [],
        num: 0,
        empty: false,
      });
  const {onlineUsers} = useContext(OnlineUsersContext)
  const navigate = useNavigate();

    useEffect(() => {
        if (!taskInfo) {
          setHistory({ option: false, cont: [], num: 0, empty: false });
        }
      }, [taskInfo]);

    const historyHandler = (e) => {
        let target = e.target.textContent;
    
        if (target.startsWith("Show history") || target == "load more") {
          taskService
            .getCurrentTaskHistory(
              x?._id,
              history.num,
              localStorage.getItem("sessionStorage")
            )
            .then((res) => {
              if (!res.message) {
                setHistory((state) => ({
                  option: true,
                  cont: [...state?.cont, ...res],
                  num: res.length > 0 ? state.num + 5 : state.num,
                  empty: res.length == 0 ? true : false,
                }));
              } else {
                console.log(res);
              }
            });
        } else {
          setHistory({ option: false, cont: [], num: 0, empty: false });
        }
      };


  return (
    <>
      <div className={styles.taskInfo}>
        <h2
          onClick={() => setTaskInfo(false)}
          className={styles.taskInfoHistoryBtn}
        >
          <svg
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </h2>

        <div className={styles.taskInfoSubDiv}>
          {!history.option ? (
            <>
              <div>
                <h2 className={styles.h2Header}>Created by:</h2>
                <div
                  className={styles.infoAuthor}
                  onClick={() => navigate(`/profile/${x?.author?._id}`)}
                >
                  <img src={x?.author.image} className={onlineUsers?.find(y => y._id == x?.author?._id) ? styles.profileImageOn : styles.profileImageOff} />
                  <h2>
                    {x?.author?.username}{" "}
                    {x?.author?._id == user?._id && "(you)"}
                  </h2>
                </div>
              </div>
              <h3>Section: {x?.in}</h3>
              <h3>Priority: {x?.priority}</h3>

              {x?.workOnIt?.username && (
                <div>
                  <h2 className={styles.h2Header}>Work on it:</h2>
                  <div
                    className={styles.infoAuthor}
                    onClick={() => navigate(`/profile/${x?.workOnIt?._id}`)}
                  >
                    <img src={x?.workOnIt?.image} className={onlineUsers?.find(y => y._id == x?.workOnIt?._id) ? styles.profileImageOn : styles.profileImageOff} />
                    <h2>
                      {x?.workOnIt?.username}{" "}
                      {x?.workOnIt?._id == user?._id && "(you)"}
                    </h2>
                  </div>
                </div>
              )}

              <span className={styles.lastUpdatedAt}>
                Last update: {format(x?.updatedAt)}
              </span>
            </>
          ) : (
            <>
              <h2 className={styles.h2HeaderCenter}>History</h2>

              {history?.cont?.map((y) => (
                <div key={y?._id} className={styles.divHistory}>
                  <div className={styles.historyAuthor}>
                    <img src={y?.user?.image} className={onlineUsers?.find(u => u._id == y?.user?._id) ? styles.profileImageOn : styles.profileImageOff} />
                    <h2>
                      {y?.user?.username} {y?.user?._id == user?._id && "(you)"}
                    </h2>
                  </div>

                  <h2 className={styles.h2HeaderForHistory}>{y?.action}</h2>

                  <span>{format(y?.createdAt)}</span>
                </div>
              ))}

              {!history.empty ? (
                <button
                  className={styles.historyBtn}
                  onClick={(e) => historyHandler(e)}
                >
                  load more
                </button>
              ) : (
                <h2 className={styles.h2HeaderCenter}>--END--</h2>
              )}
            </>
          )}
          <button
            className={styles.historyBtn1}
            onClick={(e) => historyHandler(e)}
          >
            {history?.option
              ? "Hide history"
              : `Show history ${x?.history?.length}`}
          </button>
        </div>

        <span className={styles.timeAgo}>{format(x?.createdAt)}</span>
      </div>
    </>
  );
};
