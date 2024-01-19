import styled from "./styles/login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png"
import { LoginForm } from "./components/LoginForm";
import LightDarkSwitch from "../../../components/LightDarkSwitch";

const LoginPage = () => {

  return (
    <>
      <div className={styled["container-main"]}>
        <div className={styled["image-container"]}>
          <div className={styled["title"]}>CAMAI</div>
          <div className={styled["description"]}>Solution for coffee brands to detect customers and employee behaviors
          </div>
          <img src={AuthImage} alt="AuthImage" className={styled["auth-image"]} />
        </div>
        <div className={styled["container"]}>
          <div className={styled["title"]}>
            <div>LOGIN</div>
            <LightDarkSwitch />
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
