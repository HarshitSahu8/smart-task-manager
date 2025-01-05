"use client";
import useUserStore from "@/store/userStore";
import { signIn, signUp } from "@/utils/auth";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Form = ({ FormType }: { FormType: "Log In" | "Sign Up" }) => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Redirect if the user is already signed in
    if (user) {
      router.replace("/");
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          alert("Signed in");
          const {
            data: { user },
          } = await supabase.auth.getUser();

          // Set the user in the state
          if (user) {
            setUser(user);
            // Redirect as soon as the user signs in
            router.replace("/");
          }
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router, user, setUser]);

  const handleOnFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (FormType === "Log In") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        await signIn(email, password); // Sign in after sign up
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      setError((error as Error)?.message);
    }
  };

  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {FormType}
        </h2>
        <form className="space-y-4" onSubmit={handleOnFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md text-gray-800"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {FormType}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">Error: {error}</p>}
          {FormType === "Log In" && (
            <p className="mt-4 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={`/${FormType === "Log In" ? "signup" : "login"}`}
                passHref
              >
                <span className="text-blue-500 hover:underline">Sign Up</span>
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
