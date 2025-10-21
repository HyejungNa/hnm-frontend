import React, { useState } from "react";
import "../style/navbar.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import Logo from "../component/Logo";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart); // 현재 카트에 있는 숫자들고오기
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const menuList = ["All", "Women", "Men", "Kids"];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="nav-bar">
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}

      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search..."
            onKeyPress={onCheckEnter}
          />
        </div>

        <div>
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span className="sign-in-text">SIGN OUT</span>}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span className="sign-in-text">SIGN IN</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span className="cart-item-text">{`${
                  cartItemCount || 0
                }`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}></span>}
            </div>
          </div>
        </div>
      </div>

      <Logo />

      {/* Category menu */}
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
