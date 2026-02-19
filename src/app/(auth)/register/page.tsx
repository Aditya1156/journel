"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInPage } from "@/components/ui/sign-in-flow-1";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return <SignInPage mode="register" />;
}
