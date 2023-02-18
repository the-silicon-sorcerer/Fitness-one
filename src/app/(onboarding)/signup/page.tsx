"use client";

import { useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import z from "zod";

import ButtonLarge from "../../../components/(buttons)/buttonLarge/buttonLarge.component";
import TextInput from "../../../components/(forms)/textInput/textInput.component";
import ContinueWith from "../../../components/(elements)/continueWith/continue.component";
import SignIn from "../../../components/(elements)/sign-in/signIn.compoent";
import TermsText from "../../../components/(elements)/termsText/termsText.component";
import HaveAccount from "../../../components/(elements)/haveAccount/haveAccount.component";

import { UserIcon } from "../../../components/(svg)";
import { MainIcon } from "../../../components/(svg)";
import { GoogleIcon } from "../../../components/(svg)";
import { FacebookIcon } from "../../../components/(svg)";

import style from "./page.module.css";

const SignUp = () => {
  const { status } = useSession();
  const router = useRouter();
  const nameRef = useRef({} as HTMLInputElement);
  const emailRef = useRef({} as HTMLInputElement);
  const emailSchema = z.string().email();

  const callback = "/onboarding";

  const submitEmail = () => {
    if (status === "authenticated") {
      return void router.push("/");
    }
    if (emailSchema.safeParse(emailRef.current.value).success) {
      void signIn("email", {
        callbackUrl: callback,
        email: emailRef.current.value,
      });
    }
  };

  return (
    <div className={style.container}>
      <div className={style.options}>
        <TextInput Icon={UserIcon} ref={nameRef} placeholder="Full name" />
        <TextInput Icon={MainIcon} ref={emailRef} placeholder="Email" />
        <ButtonLarge onClick={() => submitEmail()} text="Create Account" />
        <ContinueWith />
        <SignIn Icon={GoogleIcon} provider="google" callback={callback} />
        <SignIn Icon={FacebookIcon} provider="facebook" callback={callback} />
      </div>
      <div className={style.terms}>
        <TermsText />
        <HaveAccount />
      </div>
    </div>
  );
};

export default SignUp;
