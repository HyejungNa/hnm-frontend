import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Log in 버튼 disable state

  useEffect(() => {
    if (loginError) {
      setIsSubmitting(false); // 로그인 실패시 버튼 다시 active
      dispatch(clearErrors());
    }
  }, [navigate]);

  // useEffect(() => {
  //   if (loginError) {
  //     dispatch(clearErrors());
  //   }
  // }, [dispatch]);

  // const handleLoginWithEmail = (event) => {
  //   event.preventDefault();
  //   setIsSubmitting(true); // form이 submit될시 login버튼 disable됨
  //   dispatch(loginWithEmail({ email, password }));
  // };

  const handleLoginWithEmail = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable button when submitting
    try {
      await dispatch(loginWithEmail({ email, password })).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false); // Re-enable button after login attempt
    }
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
  };

  // 로그인해서 유저정보가 있는경우 로그인페이지를 보여주지않도록해줌
  if (user) {
    navigate("/");
    return null;
  }

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [user, navigate]);

  return (
    <>
      <Container className="login-area">
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <div>
              Don't have an account yet? <Link to="/register">Sign up</Link>
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>- Log in with an external account -</p>
            <div className="display-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
