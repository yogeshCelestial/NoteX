"use client"

import { cn, request, Response } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthFormProps extends React.ComponentProps<"div"> {
  formType?: 'login' | 'signup';
}

export function AuthForm({
  formType = 'login',
  className,
  ...props
}: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isSignUp = Boolean(formType !== 'login');

  const loginSuccess = (response: Response) => {
    if (typeof (response.data) === 'object' && 'refresh_token' in response.data) {
      localStorage.setItem('refresh_token', String(response?.data?.refresh_token));
      router.push('/');
    }
    setLoading(false);
  };

  const loginOrSignupFailed = (error: Error) => {
     toast("Operation Failed!", {
            description: error?.message || 'Try Again.',
      });
      setLoading(false);
  }

  const signUpSuccess = (response: Response) => {
    console.log('Sign up Success!', response?.message);
    setLoading(false);
    router.push('/login');
  }

  const onFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement
    const formData = new FormData(form);
    const plainData = Object.fromEntries(formData.entries());

    if (isSignUp) {
      if (plainData.password === plainData.confirmPassword) {
        const httpObj = { endpoint: '/auth/register', data: plainData, authorization: false }
        request(httpObj, signUpSuccess, loginOrSignupFailed);
      } else {
        console.warn("Password and Confirm Password didn't match");
        setLoading(false);
      }

    } else {
      const httpObj = { endpoint: '/auth/login', data: plainData }
      request(httpObj, loginSuccess, loginOrSignupFailed);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
      <p className="text-2xl font-semibold">NoteX</p>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              isSignUp ? 'Sign Up' : 'Login'
            }
          </CardTitle>
          <CardDescription>
            Enter your email {isSignUp && 'create a password'} below to {isSignUp ? 'create' : 'login to'} your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form name="loginForm" id="login-form" onSubmit={onFormSubmission}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}

                </div>
                <Input name="password" id="password" type="password" required />
              </div>
              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input name="confirmPassword" id="confirmPassword" type="password" required />
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {formType === 'login' ? 'Login' : 'Sign Up'}
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="mt-4">
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div> */}
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <React.Fragment>
                Already have an account?{" "}
                <a type="button" onClick={() => router.push('/login')} href="#" className="underline underline-offset-4">
                  Login
                </a>
              </React.Fragment>) : (
              <React.Fragment>
                Don&apos;t have an account?{" "}
                <a type="button" onClick={() => router.push('/signup')} href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </React.Fragment>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
