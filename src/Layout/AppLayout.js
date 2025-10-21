import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../common/component/Sidebar";
import Logo from "../common/component/Logo";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch(loginWithToken()); // 웹페이지 처음들어올때 로그인이되있는지 바로 확인하기위해 실행
  // }, [dispatch]);

  // useEffect(() => {
  //   // Check for token in sessionStorage and dispatch loginWithToken if present
  //   if (sessionStorage.getItem("token")) {
  //     dispatch(loginWithToken());
  //   }
  // }, [dispatch]);

  useEffect(() => {
    // 세션스토리지에 토큰이 있을 때만 실행
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

  // 카트안에있는 전체 아이템 갯수 항상 최신값으로 보여줌 (nav bar에 위치)
  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user, dispatch]);

  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          <Navbar user={user} />
          {children}
        </>
      )}
    </div>
  );
};

export default AppLayout;
