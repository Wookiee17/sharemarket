import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSignInEmailPassword } from "@nhost/nextjs";
import { useForm } from "react-hook-form";
import * as Components from "../../assets/styles/Components";

import { useDispatch, useSelector } from "react-redux";
import { setIsAuth } from "../../../store/shield/ShieldSlice";
import {
  setUserRole,
  setLoading,
  setUser,
} from "../../../store/shield/ShieldSlice";

export const Logins = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const { router, query } = useRouter();
  const { signIn } = props;
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();

  const { isAuth, loading } = useSelector((state) => state.Shield);

  const { signInEmailPassword, isLoading, isSuccess, isError, error } =
    useSignInEmailPassword();

  const onSubmit = async (data) => {
    console.log("submitted");
    // debugger;
    try {
      const user = await signInEmailPassword(data?.email, data?.password);
      dispatch(setUser(user?.user));
      dispatch(setLoading(true));
      console.log(loading, "sign in loading-->");
      if (user?.error?.status === 401) throw new Error(user?.error?.message);
      console.log(user, "Data");
      localStorage.setItem("user_id", user.user.id);
      dispatch(setIsAuth(true));
      dispatch(setUser(user?.user));
    } catch (error) {
      swal({
        text: error?.message,
        icon: "warning",
        title: "Warming",
      });
      console.log(error, "Error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-form-container">
      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSubmit(onSubmit)}>
          <Components.Title>Sign in</Components.Title>
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
                message: "Please enter your Password",
              },
            })}
            value={password}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          {/* <Components.Title>OR</Components.Title>
      <Components.Input type="tel" placeholder="MOBILE NUMBER" />
      <Components.Input type="tel" placeholder="OTP" /> */}
          <Components.GhostButton type={"submit"} size={"lg"}>
            Sign In
          </Components.GhostButton>
        </Components.Form>
      </Components.SignInContainer>
    </div>
  );
};
