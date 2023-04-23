import React, { useEffect, useState } from "react";
import * as Components from "../../common/assets/styles/Components";
import { useRouter } from "next/router";
import Button from "../../common/component/button/Button";
import logo from "../../common/assets/images/logo.png";
import { useSignUpEmailPassword } from "@nhost/nextjs";
import { useForm } from "react-hook-form";
import { Logins } from "../../common/component/login/logins";
import swal from "sweetalert";

function Login() {
  const [signIn, toggle] = React.useState(true);
  const router = useRouter();

  //States
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  //Sign-Up
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      cpassword: "",
    },
  });
  const { errors, isSubmitted } = formState;

  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignUpEmailPassword();

  // const sendVerificationEmail = async (email) => {
  //   console.log(email,"email");
  //   await nhost.auth.sendVerificationEmail({
  //     email, options: {
  //     redirectTo: "/authentication"
  //   }})
  // };
  const disableForm = isLoading || needsEmailVerification;

  const onSubmit = async (data) => {
    console.log("checkingsubmit", data);
    try {
      const user = await signUpEmailPassword(data?.email, data?.password, {
        allowedRoles: ["customer"],
        displayName: data?.name,
        defaultRole: "customer",
        // redirectTo: "/authentication",
      });
      if (user?.error?.status === 409) throw new Error(user?.error?.message);
      console.log(user, "Data");
      swal({
        text: "Account is Created Successfully",
        icon: "success",
        title: "Success",
      });
      toggle(true);
    } catch (error) {
      swal({
        text: error?.message,
        icon: "warning",
        title: "Warning!",
      });
    }
  };

  // if (isSuccess) {
  //   router.push("/");
  //   return null;
  // }

  return (
    <Components.Wrappper>
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSubmit(onSubmit)}>
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              placeholder="Name"
              {...register("name", {
                required: {
                  value: true,
                  message: "Please enter your Name",
                },
              })}
              disabled={disableForm}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Components.Input
              type="tel"
              placeholder="Mobile Number"
              {...register("phoneNumber", {
                required: {
                  value: true,
                  message: "Please enter your Number",
                },
              })}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Components.Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter your email",
                },
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Components.Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter your Name",
                },
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Components.Input
              type="password"
              placeholder="Confirm Password"
              {...register("cpassword", {
                required: {
                  value: true,
                  message: "Please enter your Name",
                },
              })}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
            />
            <Components.GhostButton
              type={"submit"}
              size={"lg"}
              // onClick={handleSubmit(onSubmit)}
            >
              Sign Up
            </Components.GhostButton>
          </Components.Form>
        </Components.SignUpContainer>

        <Logins signIn={signIn} />

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Logo src={logo.src} />
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                If you have an account with us, please sign in here.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Logo src={logo.src} />
              <Components.Title>Welcome!</Components.Title>
              <Components.Paragraph>
                Don&apos;t have an account? Register here.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.Wrappper>
  );
}

export default Login;
