import styles from './profile.module.css'
import * as authService from "../../services/authService";

export const FollowAndUnfollow = ({ user, dataUser, setDataUser}) => {

  const toggleFollow = () => {
    authService
      .toggleFollowPerson(localStorage.getItem("sessionStorage"), dataUser?._id)
      .then((res) => {
        if (!res.message) {
          setDataUser((state) => ({
            ...state,
            ["followers"]: res,
          }));
        } else {
          console.log(res);
        }
      });
  };

  return (
    <>
      <div className={styles.lastBtns}>
        {user?._id != dataUser?._id &&
          (dataUser?.followers.includes(user?._id) ? (
            <button
              className={styles.btnPrimary}
              onClick={() => toggleFollow()}
            >
              Unfollow
            </button>
          ) : (
            <button
              className={styles.btnPrimary}
              onClick={() => toggleFollow()}
            >
              Follow
            </button>
          ))}
      </div>
    </>
  );
};
