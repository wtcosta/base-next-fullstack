import SignInForm from "@/components/auth/SignInForm";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  if (session) redirect("/");

  return <SignInForm />;
}
