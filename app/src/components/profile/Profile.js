import { useContext, useEffect, useRef, useState } from "react";
import styles from "./profile.module.css";
import * as authService from "../../services/authService";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

import { addOneImage, removeOneImage } from "../../utils/addRemoveImages";

let colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#FF3592",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState(null);
  const navigate = useNavigate();
  const uploadImage = useRef(null);
  const [values, setValues] = useState({
    image: "",
    password: "",
    newPassword: "",
  });
  const [del, setDel] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("sessionStorage");
    let urlId = window.location.pathname.split("/profile/")[1];

    authService.getUserById(token, urlId).then((res) => {
      if (res.email) {
        setDataUser(res);
        setValues({ image: res?.image, password: "", newPassword: "" });
      } else {
      }
    });
  }, [window.location.pathname]);

  const changeColor = (e) => {
    e.target.style.color = colors[Math.floor(Math.random() * colors.length)];
  };

  const inputChangeHandler = (e) => {
    setValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (values?.image != dataUser?.image && values.image != "") {
      authService
        .editImageProfile(
          values?.image,
          dataUser?._id,
          localStorage.getItem("sessionStorage")
        )
        .then((res) => {
          if (!res.message) {
            setValues((state) => ({
              ...state,
              ["image"]: res?.image,
            }));
          } else {
            console.log(res);
          }
        });
    }
  }, [values?.image]);

  const onEditHandler = () => {
    if (
      values.password != "" &&
      values.newPassword != "" &&
      values.password.length > 3 &&
      values.newPassword.length > 3
    ) {
      authService.editProfile(values, user?._id, user?.token).then((res) => {
        if (!res.message) {
          setValues({
            image: "",
            password: "",
            newPassword: "",
          });

          navigate("/profile");
        } else {
          console.log(res.message);
        }
      });
    } else {
      console.log("Password and new password must be at least 3 character!");
    }
  };

  const onDeleteHandler = () => {
    if (values.password != "" && values.password.length > 3) {
      authService.deleteAccount(values.password, user?.token).then((res) => {
        if (res.message == "finished") {
          setUser(null);
          localStorage.removeItem("sessionStorage");

          navigate("/register");
        } else {
          console.log(res.message);
        }
      });
    } else {
      console.log("Type your password to del acc!");
    }
  };

  const toggleFollow = () => {
    authService
      .toggleFollowPerson(localStorage.getItem("sessionStorage"), dataUser?._id)
      .then((res) => {
        if (!res.message) {
          setDataUser(state => ({
            ...state,
            ["followers"]: res,
          }));
        } else {
          console.log(res);
        }
      });
  };

  return (
    <div className={styles.main}>
      {dataUser?._id ? (
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
            <h2>{dataUser?.email.split("@")[0]}</h2>

            <div className={styles.followersAndFollowing}>
              <h2>
                Followers: <span>{dataUser?.followers?.length}</span>
              </h2>
              <h2>
                Following: <span>{dataUser?.following?.length}</span>
              </h2>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.notFound}>
          <h2 onClick={(e) => changeColor(e)}>4</h2>
          <h2 onClick={(e) => changeColor(e)}>0</h2>
          <h2 onClick={(e) => changeColor(e)}>4</h2>
        </div>
      )}

      <hr className={styles.line} />

      {dataUser?._id ? (
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
      ) : (
        <div>
          <button className={styles.btnPrimary} onClick={() => navigate("/")}>
            BACK
          </button>
        </div>
      )}

      {user?._id == dataUser?._id && (
        <>
          <div className={styles.inputs}>
            <input type="email" disabled defaultValue={dataUser?.email} />
            <input
              type="password"
              placeholder="Your password"
              name="password"
              value={values.password}
              onChange={(e) => inputChangeHandler(e)}
            />
            {!del && (
              <input
                type="password"
                placeholder="New password"
                name="newPassword"
                value={values.newPassword}
                onChange={(e) => inputChangeHandler(e)}
              />
            )}
          </div>

          <div className={styles.lastBtns}>
            {del ? (
              <>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setDel(false)}
                >
                  No
                </button>
                <button
                  className={styles.btnPrimary1}
                  onClick={() => onDeleteHandler()}
                >
                  Yes
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.btnPrimary}
                  onClick={() => onEditHandler()}
                >
                  Edit
                </button>
                <button
                  className={styles.btnPrimary1}
                  onClick={() => setDel(true)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
