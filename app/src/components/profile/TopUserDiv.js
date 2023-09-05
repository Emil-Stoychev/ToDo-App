import styles from "./profile.module.css";
import { addOneImage, removeOneImage } from "../../utils/addRemoveImages";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnlineUsersContext } from "../../context/onlineUsersContext";

export const TopUserDiv = ({
  user,
  dataUser,
  values,
  setValues,
  setShowUsers,
}) => {
  const uploadImage = useRef(null);
  const navigate = useNavigate()
  const { onlineUsers } = useContext(OnlineUsersContext);

  return (
      dataUser?._id ? (
        <>
        <div className={styles.top}>
        <div className={styles.image}>
            <img
              onClick={() => uploadImage.current.click()}
              src={
                dataUser?.email != undefined
                  ? values?.image
                  : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
              }
              alt="profileImage"
              className={onlineUsers?.find(x => x._id == dataUser?._id) ? styles.profileImageOn : styles.profileImageOff}
            />
            {user?._id == dataUser?._id ? (
              <input
                type="file"
                className="none"
                ref={(e) => (uploadImage.current = e)}
                onChange={(e) => addOneImage(e, values, setValues)}
              />
            ) : (
              <input
                type="file"
                className="none"
                ref={(e) => (uploadImage.current = e)}
              />
            )}
          </div>

          <div className={styles.name}>
            <h2>{dataUser?.username || ''}</h2>

            <div className={styles.followersAndFollowing}>
              <h2
                onClick={() =>
                  setShowUsers((state) => ({
                    ...state,
                    option: true,
                    name: "followers",
                  }))
                }
              >
                Followers: <span>{dataUser?.followers?.length}</span>
              </h2>
              <h2
                onClick={() =>
                  setShowUsers((state) => ({
                    ...state,
                    option: true,
                    name: "following",
                }))
            }
            >
            Following: <span>{dataUser?.following?.length}</span>
            </h2>
            </div>
            </div>
            </div>
            </>
            ) : (
                <div>
                <button className={styles.btnPrimary} onClick={() => navigate("/")}>BACK</button>
                </div>
      )
  );
};
