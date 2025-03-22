import SignUpForm from "@/components/auth/SignUpForm";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function SignUp() {
  const session = await auth();
  if (session) redirect("/");
  
  return <SignUpForm />;
}
