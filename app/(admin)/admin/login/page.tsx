"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { toast } from "sonner";

// TODO: Semantic HTML
// TODO: Add illustration if have extra time to do it

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState<
    "login" | "forgot" | "register"
  >("login");

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      router.push("/admin/services");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-main">
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="Positivus"
              width={28}
              height={28}
            />
            <h1 className="text-2xl font-semibold text-black">Positivus</h1>
          </div>

          {/* <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-black mb-6 leading-tight">
              Effortlessly manage your team and operations.
            </h2>
            <p className="text-black/80 text-lg leading-relaxed">
              Log in to access your CRM dashboard and manage your team.
            </p>
          </div> */}

          <div className="flex justify-between items-center text-black/70 text-sm">
            <span>Copyright © 2025 Positivus Enterprises LTD.</span>
            <span className="cursor-pointer hover:text-black/90">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center gap-2 justify-center mx-auto mb-3">
              <Image
                src="/logo/logo.svg"
                alt="Positivus"
                width={28}
                height={28}
              />
            </div>
            <h1 className="text-2xl font-semibold text-black">Positivus</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-center">
              {currentView === "forgot" && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("login")}
                  className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-3xl text-foreground">
                {currentView === "login" && "Admin Login"}
                {currentView === "forgot" && "Reset Password"}
              </h2>
              <p className="text-muted-foreground">
                {currentView === "login" &&
                  "Enter your admin credentials to access the dashboard."}
                {currentView === "forgot" &&
                  "Enter your email address and we'll send you a reset link."}
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
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]"
                />
              </div>

              {currentView !== "forgot" && (
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter password"
                      className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentView === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-gray-300 cursor-pointer"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember Me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
                    onClick={() => setCurrentView("forgot")}
                  >
                    Forgot Your Password?
                  </Button>
                </div>
              )}
            </div>

            <Button
              className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentView === "login" ? (
                "Log In"
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {currentView === "forgot" && (
              <div className="text-center text-sm text-muted-foreground">
                Remember Your Password?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                  style={{ color: "#3F3FF3" }}
                  onClick={() => setCurrentView("login")}
                >
                  Back to Login.
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
