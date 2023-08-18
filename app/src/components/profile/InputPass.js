import { useState } from "react";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";

import * as authService from "../../services/authService";

export const InputPass = ({ values, setValues, user, setUser, dataUser}) => {
  const [del, setDel] = useState(false);
  const navigate = useNavigate()

  const inputChangeHandler = (e) => {
    setValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

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
  return (
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
            <button className={styles.btnPrimary} onClick={() => setDel(false)}>
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
            <button className={styles.btnPrimary1} onClick={() => setDel(true)}>
              Delete
            </button>
          </>
        )}
      </div>
    </>
  );
};
