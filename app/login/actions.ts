"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const emailOrUsername = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!emailOrUsername || !password) {
    return { error: "Username or email and password are required" };
  }

  let finalEmail = emailOrUsername.trim();
  if (!finalEmail.includes("@")) {
    finalEmail = `${finalEmail.toLowerCase()}@maharlikarepublic.internal`;
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: finalEmail,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/account");
}

export async function signup(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const age = formData.get("age") as string;
  const birthday = formData.get("birthday") as string;
  const password = formData.get("password") as string;

  if (!username || !fullName || !age || !birthday || !password) {
    return { error: "Username, full name, age, birthday, and password are required" };
  }

  let finalEmail = email ? email.trim() : "";
  if (!finalEmail) {
    finalEmail = `${username.toLowerCase().trim()}@maharlikarepublic.internal`;
  }

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email: finalEmail,
    password,
    options: {
      data: {
        username: username.trim(),
        full_name: fullName.trim(),
        age: parseInt(age, 10),
        birthday,
      }
    }
  });

  if (error) {
    return { error: error.message };
  }
  
  if (data?.user?.identities?.length === 0) {
    return { error: "An account with this username or email already exists." };
  }

  redirect("/account");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
