import { useContext, useEffect, useState } from "react";
import styles from "./profile.module.css";
import * as authService from "../../services/authService";
import { AuthContext } from "../../context/authContext";

import { DivForUsers } from "./DivForUsers";
import { InputPass } from "./InputPass";
import { TopUserDiv } from "./TopUserDiv";
import { FollowAndUnfollow } from "./FollowAndUnfollow";

let colors = ["#FF6633","#FFB399","#FF33FF","#FFFF99","#FF3592","#00B3E6","#E6B333","#3366E6","#999966","#809980","#E6FF80","#1AFF33","#999933","#FF3380","#CCCC00","#66E64D","#4D80CC","#FF4D4D","#99E6E6","#6666FF",
];

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState(null);
  const [showUsers, setShowUsers] = useState({
    option: false,
    name: "",
    array: [],
  });
  const [values, setValues] = useState({
    image: "",
    password: "",
    newPassword: "",
  });

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

  useEffect(() => {
    if (showUsers.option) {
      if (showUsers.name == "followers") {
        authService
          .getUserFollowers(
            localStorage.getItem("sessionStorage"),
            dataUser?._id
          )
          .then((res) => {
            if (!res.message) {
              setShowUsers((state) => ({
                ...state,
                array: res,
              }));
            } else {
              console.log(res);
            }
          });
      } else if (showUsers.name == "following") {
        authService
          .getUserFollowing(
            localStorage.getItem("sessionStorage"),
            dataUser?._id
          )
          .then((res) => {
            if (!res.message) {
              setShowUsers((state) => ({
                ...state,
                array: res,
              }));
            } else {
              console.log(res);
            }
          });
      }
    }
  }, [showUsers.option, showUsers.name]);

  return (
    <div className={styles.main}>

      {showUsers.option && <DivForUsers showUsers={showUsers} setShowUsers={setShowUsers} user={user} />}

      {!showUsers.option && (
        <>
          {dataUser?._id ? (
            <TopUserDiv user={user} dataUser={dataUser} values={values} setValues={setValues} setShowUsers={setShowUsers} />
          ) : (
            <div className={styles.notFound}>
              <h2 onClick={(e) => changeColor(e)}>4</h2>
              <h2 onClick={(e) => changeColor(e)}>0</h2>
              <h2 onClick={(e) => changeColor(e)}>4</h2>
            </div>
          )}

          <hr className={styles.line} />

          <FollowAndUnfollow user={user} dataUser={dataUser} setDataUser={setDataUser} />

          {user?._id == dataUser?._id && <InputPass values={values} setValues={setValues} user={user} setUser={setUser} dataUser={dataUser} />}
        </>
      )}
    </div>
  );
};

export default Profile;
