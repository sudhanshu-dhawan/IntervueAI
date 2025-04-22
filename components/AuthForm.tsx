"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {Form} from "@/components/ui/form"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter  } from "next/navigation"
import { auth } from "@/firebase/client"
import { createUserWithEmailAndPassword ,  signInWithEmailAndPassword } from "firebase/auth"
import { signIn , signUp } from "@/lib/actions/auth.action"

type FormType = "sign-in" | "sign-up"

const authFormSchema = (type:FormType)=>{
    return z.object({
        name: type==='sign-up' ? z.string().min(3) : z.string().optional(),
        email:z.string().email(),
        password: z.string().min(3)
    })
}

const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter();

    const formSchema = authFormSchema(type)

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isSignIn = type === "sign-in"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      password:"",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        if(type==='sign-up'){


            const {name , email , password} = values;
            const userCredentials = await createUserWithEmailAndPassword(auth , email , password)

            const result = await signUp({
                uid:userCredentials.user.uid,
                name:name!,
                email,
                password,
            })
            if(!result.success){
                toast.error(result.message);
                return;
            }
            toast.success("Account created successfully. Please sign in.")
            router.push('/sign-in')
            console.log('SIGN UP', values);
        }
        else{
            
            const {email , password} = values;
            const userCredentials = await signInWithEmailAndPassword(auth , email , password)

            const idToken = await userCredentials.user.getIdToken()
            
            if(!idToken){
                toast.error('Sign in falied')
                return ;
            }

            await signIn({
                email , idToken
            })

            toast.success('Sign in successfully.');
            router.push('/')
        }
    }
    catch(err){
        console.log(err);
        toast.error(`There was an error: ${err}`)

    }
  }

  return (
    <div
    className="relative w-full max-w-md min-h-[500px] mx-auto rounded-xl overflow-hidden  "      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
    >
      {/* Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-200 ease-out"
        style={{
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(108, 38, 255, 0.5), transparent 60%)`,
            transition: 'background 0.1s ease-out',
          }}
          
      />

      {/* Card Content */}
      <div className="relative z-10 bg-[#111111]/60 backdrop-blur p-10 rounded-xl flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/interview.png" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">IntervueAI</h2>
        </div>

        <h3>Practice your job interview with AI</h3>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4"
          >
            {!isSignIn && (
              <FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              />
            

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>

          <p className="text-center">
            {isSignIn ? "No account yet?" : "Already have an account"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}

export default AuthForm
