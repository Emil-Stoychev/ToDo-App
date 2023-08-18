import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";

export const DivForUsers = ({ showUsers, setShowUsers, user }) => {
  const navigate = useNavigate();

  const navigateToUserAcc = (userId) => {
    setShowUsers({ option: false, name: "", array: [] });
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <div className={styles.divForUsers}>
        <button
          className={styles.xBtn}
          onClick={() =>
            setShowUsers((state) => ({ option: false, name: "", array: [] }))
          }
        >
          X
        </button>

        <div className={styles.usersNavBar}>
          <h2
            onClick={() =>
              setShowUsers((state) => ({
                ...state,
                name: "followers",
              }))
            }
            className={showUsers.name == "followers" ? styles.h2Border : ""}
          >
            Followers
          </h2>
          <span>|</span>
          <h2
            onClick={() =>
              setShowUsers((state) => ({
                ...state,
                name: "following",
              }))
            }
            className={showUsers.name == "following" ? styles.h2Border : ""}
          >
            Following
          </h2>
        </div>

        <hr className={styles.line} />

        <div className={styles.usersRendering}>
          {showUsers.array.map((x) => (
            <div className={styles.userTemplate} key={x._id}>
              <div className={styles.userTamplateTop}>
                <img
                  onClick={() => navigateToUserAcc(x._id)}
                  src={
                    x.image ||
                    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  }
                  alt="user image"
                />
                <h2 onClick={() => navigateToUserAcc(x._id)}>
                  {x.email.split("@")[0]} {x._id == user?._id && "(you)"}
                </h2>
              </div>

              <div className={styles.userTamplateBottom}>
                <button onClick={() => navigateToUserAcc(x._id)}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
