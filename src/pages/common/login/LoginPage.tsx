import styled from "./login.module.scss";
import AuthImage from "../../../assets/images/login_signup_main.png"
import { LoginForm } from "./LoginForm";
import LightDarkSwitch from "../../../components/button/LightDarkSwitch";

const LoginPage = () => {

  return (
    <>
      <div className={styled["container-main"]}>
        <div className={styled["image-container"]}>
          <div className={styled["title"]}>CAMAI - ADMIN</div>
          <div className={styled["description"]}>Solution for coffee brands to detect customers and employee behaviors
          </div>
          <img src={AuthImage} alt="AuthImage" className={styled["auth-image"]} />
        </div>
        <div className={styled["container"]}>
          <div className={styled["title"]}>
            <div>LOGIN</div>
            <LightDarkSwitch size="lg"/>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
