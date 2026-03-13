"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type AccountAuthPanelProps = {
  initialMode?: "signin" | "signup" | "forgot" | "reset";
  initialError?: string;
  resetToken?: string;
};

type Mode = NonNullable<AccountAuthPanelProps["initialMode"]>;

const authModes: Array<{ id: Exclude<Mode, "reset">; label: string }> = [
  { id: "signin", label: "Sign In" },
  { id: "signup", label: "Create Account" },
  { id: "forgot", label: "Forgot Password" },
];

export function AccountAuthPanel({
  initialMode = "signin",
  initialError,
  resetToken,
}: AccountAuthPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(resetToken ? "reset" : initialMode);
  const [error, setError] = useState(initialError ?? "");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [signInValues, setSignInValues] = useState({ email: "", password: "" });
  const [signUpValues, setSignUpValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetValues, setResetValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const heading = useMemo(() => {
    switch (mode) {
      case "signup":
        return "Create your Glory account";
      case "forgot":
        return "Reset your password";
      case "reset":
        return "Choose a new password";
      default:
        return "Access your Glory account";
    }
  }, [mode]);

  function switchMode(nextMode: Exclude<Mode, "reset">) {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setResetUrl("");
  }

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const result = await signIn("credentials", {
      email: signInValues.email,
      password: signInValues.password,
      redirect: false,
      callbackUrl: "/account",
    });

    setPending(false);

    if (result?.error) {
      setError("The email or password is incorrect.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpValues),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setPending(false);
      setError(payload?.error ?? "Unable to create your account.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: signUpValues.email,
      password: signUpValues.password,
      redirect: false,
    });

    setPending(false);

    if (signInResult?.error) {
      setMode("signin");
      setSuccess("Account created. Sign in with your new credentials.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    setResetUrl("");

    const response = await fetch("/api/account/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string; resetUrl?: string }
      | null;

    setPending(false);

    if (!response.ok) {
      setError(payload?.error ?? "Unable to prepare a reset link.");
      return;
    }

    setSuccess(payload?.message ?? "If that account exists, a reset link has been prepared.");
    setResetUrl(payload?.resetUrl ?? "");
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/account/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: resetToken,
        password: resetValues.password,
        confirmPassword: resetValues.confirmPassword,
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;

    setPending(false);

    if (!response.ok) {
      setError(payload?.error ?? "Unable to reset your password.");
      return;
    }

    setSuccess(payload?.message ?? "Password updated.");
    setMode("signin");
    setResetValues({ password: "", confirmPassword: "" });
  }

  return (
    <div className="grid gap-8 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
          Account Access
        </p>
        <h1 className="text-4xl font-semibold leading-tight">{heading}</h1>
        <p className="max-w-lg text-base leading-7 text-[var(--muted)]">
          Sign in to view recent orders, loyalty points, and your customer profile.
          New customers can create an account in a minute.
        </p>
        <div className="rounded-3xl bg-[var(--surface-soft)] p-6">
          <p className="text-sm font-semibold">What you get after sign-in</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
            <div className="rounded-2xl bg-white/70 p-4">Track your latest orders</div>
            <div className="rounded-2xl bg-white/70 p-4">Review points and rewards</div>
            <div className="rounded-2xl bg-white/70 p-4">Manage profile and saved details</div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-black/5 bg-white/70 p-6">
        {mode !== "reset" ? (
          <div className="mb-5 flex flex-wrap gap-3">
            {authModes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => switchMode(item.id)}
                className={mode === item.id ? "btn-primary" : "btn-secondary"}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {success ? (
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <p>{success}</p>
            {resetUrl ? (
              <Link href={resetUrl} className="mt-2 inline-block font-medium underline">
                Open reset link
              </Link>
            ) : null}
          </div>
        ) : null}

        {mode === "signin" ? (
          <form className="space-y-4" onSubmit={handleSignIn}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="email"
                value={signInValues.email}
                onChange={(event) =>
                  setSignInValues((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="password"
                value={signInValues.password}
                onChange={(event) =>
                  setSignInValues((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </label>
            <button className="btn-primary w-full" type="submit" disabled={pending}>
              {pending ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-[var(--muted)]">
              New here?{" "}
              <button
                type="button"
                className="font-medium text-[var(--accent-strong)] underline"
                onClick={() => switchMode("signup")}
              >
                Create an account
              </button>
            </p>
          </form>
        ) : null}

        {mode === "signup" ? (
          <form className="space-y-4" onSubmit={handleSignUp}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Name</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="text"
                value={signUpValues.name}
                onChange={(event) =>
                  setSignUpValues((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="email"
                value={signUpValues.email}
                onChange={(event) =>
                  setSignUpValues((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="password"
                value={signUpValues.password}
                onChange={(event) =>
                  setSignUpValues((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </label>
            <button className="btn-primary w-full" type="submit" disabled={pending}>
              {pending ? "Creating Account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-[var(--muted)]">
              Already signed up?{" "}
              <button
                type="button"
                className="font-medium text-[var(--accent-strong)] underline"
                onClick={() => switchMode("signin")}
              >
                Go to login
              </button>
            </p>
          </form>
        ) : null}

        {mode === "forgot" ? (
          <form className="space-y-4" onSubmit={handleForgotPassword}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                required
              />
            </label>
            <button className="btn-primary w-full" type="submit" disabled={pending}>
              {pending ? "Preparing Link..." : "Prepare Reset Link"}
            </button>
            <p className="text-center text-sm text-[var(--muted)]">
              Remembered your password?{" "}
              <button
                type="button"
                className="font-medium text-[var(--accent-strong)] underline"
                onClick={() => switchMode("signin")}
              >
                Go to login
              </button>
            </p>
          </form>
        ) : null}

        {mode === "reset" ? (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">New Password</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="password"
                value={resetValues.password}
                onChange={(event) =>
                  setResetValues((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Confirm Password</span>
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                type="password"
                value={resetValues.confirmPassword}
                onChange={(event) =>
                  setResetValues((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                required
              />
            </label>
            <button className="btn-primary w-full" type="submit" disabled={pending}>
              {pending ? "Updating Password..." : "Update Password"}
            </button>
            <p className="text-center text-sm text-[var(--muted)]">
              Already signed up?{" "}
              <button
                type="button"
                className="font-medium text-[var(--accent-strong)] underline"
                onClick={() => switchMode("signin")}
              >
                Go to login
              </button>
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
}
