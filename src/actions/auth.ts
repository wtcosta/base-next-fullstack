'use server';

import { signIn, signOut, signUp } from "@/services/auth";
import { executeAction } from "@/lib/executeAction";
import { redirect } from "next/navigation";

export async function handleSignIn(prevState: { error: string | null }, formData: FormData) {
  try {
    const result = await signIn("credentials", {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Credenciais inválidas", success: false };
    }

    return { error: null, success: true };
  } catch (error) {
    console.error(JSON.stringify(error))
    return { error: "Ocorreu um erro ao fazer login", success: false };
  }
}

export async function handleSignUp(formData: FormData) {
  await executeAction({
    actionFn: async () => {
      await signUp(formData);
      redirect("/");
    },
  });
}

export async function handleLogout() {
  await executeAction({
    actionFn: async () => {
      await signOut();
      redirect("/");
    },
  });
}