// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const [isAnimationActive, setIsAnimationActive] = useState(true);


  const { theme } = useTheme();
  useEffect(() => {
    console.log(`Theme ===> `, theme)
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
}, [theme])


  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    // setAllowAnimate(false)
    if (isAnimationActive) setIsAnimationActive(false);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // const handleSettings = (e) => {
  //   e.preventDefault();
  //   navigate("/settings")
  // };

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate("/")
  };

  return (
    <div className="profile_anchor">
      <button
        className={`profile_btn _button ${user ? "" : "attention-button"}`}
        onClick={toggleMenu}
      >
        <i className="fas fa-user black_font" />
        {!user && <div className="arrow"></div>}
      </button>

      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <div className="profile_dropdown_grid">
              <p>{user.email}</p>
              <button className="_button black_font" onClick={logout}>Log Out</button>
            </div>
          ) : (
            <div className="popupDiv">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                className="openModalBtn"
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                className="openModalBtn"
                modalComponent={<SignupFormModal />}
              />
            </div>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
