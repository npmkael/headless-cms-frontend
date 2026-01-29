"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Zod schema for forgot password form validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "forgot">("login");

  const router = useRouter();
  const supabase = createClient();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Forgot password form
  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push("/admin/services");
      router.refresh();
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset link sent! Check your email.");
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const isLoginSubmitting = loginForm.formState.isSubmitting;
  const isForgotSubmitting = forgotForm.formState.isSubmitting;
  const isLoading = isLoginSubmitting || isForgotSubmitting;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden bg-main lg:flex lg:w-1/2">
        <div className="relative z-10 flex w-full flex-col justify-between px-12 py-12">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="Positivus"
              width={28}
              height={28}
            />
            <h1 className="text-2xl font-semibold text-black">Positivus</h1>
          </div>

          <div className="flex items-center justify-between text-sm text-black/70">
            <span>Copyright © 2025 Positivus Enterprises LTD.</span>
            <span className="cursor-pointer hover:text-black/90">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex items-center justify-center gap-2">
              <Image
                src="/logo/logo.svg"
                alt="Positivus"
                width={28}
                height={28}
              />
            </div>
            <h1 className="text-2xl font-semibold text-black">Positivus</h1>
          </div>

          {currentView === "login" ? (
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl text-foreground">Admin Login</h2>
                <p className="text-muted-foreground">
                  Enter your admin credentials to access the dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    disabled={isLoading}
                    placeholder="user@company.com"
                    className="h-12 rounded-lg border-gray-200 bg-white shadow-none focus:border-[#3F3FF3] focus:ring-0"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Enter password"
                      className="h-12 rounded-lg border-gray-200 bg-white pr-10 shadow-none focus:border-[#3F3FF3] focus:ring-0"
                      {...loginForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="cursor-pointer rounded border-gray-300"
                    />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer text-sm text-muted-foreground"
                    >
                      Remember Me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto cursor-pointer p-0 text-sm hover:text-opacity-80"
                    onClick={() => setCurrentView("forgot")}
                  >
                    Forgot Your Password?
                  </Button>
                </div>
              </div>

              <Button
                className="h-12 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-none hover:opacity-90"
                disabled={isLoading}
                type="submit"
              >
                {isLoginSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={forgotForm.handleSubmit(handleForgotPassword)}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentView("login")}
                  className="absolute left-8 top-8 cursor-pointer p-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl text-foreground">Reset Password</h2>
                <p className="text-muted-foreground">
                  Enter your email address and we&apos;ll send you a reset link.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="forgot-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    disabled={isLoading}
                    placeholder="user@company.com"
                    className="h-12 rounded-lg border-gray-200 bg-white shadow-none focus:border-[#3F3FF3] focus:ring-0"
                    {...forgotForm.register("email")}
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                className="h-12 w-full cursor-pointer rounded-lg text-sm font-medium text-white shadow-none hover:opacity-90"
                disabled={isLoading}
                type="submit"
              >
                {isForgotSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Remember Your Password?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto cursor-pointer p-0 text-sm font-medium hover:text-opacity-80"
                  style={{ color: "#3F3FF3" }}
                  onClick={() => setCurrentView("login")}
                >
                  Back to Login.
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
