"use client"
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "../../utils/styles";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation } from "@apollo/client";

import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";
import toast from "react-hot-toast";


const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8characters long!"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPaswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({activationToken} : {activationToken : string | string[]}) => {

  const [resetPassword , {loading, error, data}] = useMutation(RESET_PASSWORD);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPaswordSchema>({ resolver: zodResolver(formSchema) });


  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit = async (data: ResetPaswordSchema): Promise<void> => {
    try {
        const response = await resetPassword({
            variables: {
                password: data.password,
                activationToken: activationToken
            },
        });
        console.log("🚀 ~ response:", response)
        toast.success("Password reset successfully");
    } catch(error: any) {
        toast.error(error.message);
    }
  };
  
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="md:w-[500px] w-full bg-slate-900 rounded shadow-sm p-3">
      <h1 className={`${styles.title}`}>Reset your password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
                Enter your password
            </label>
            <input
                {...register("password")}
                type={!showPassword ? "password" : "text"}
                placeholder="password!@%"
                className={`${styles.input}`}
            />
            {!showPassword ? (
                <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShowPassword(true)}
                />
            ) : (
                <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShowPassword(false)}
                />
            )}
            </div>
            {errors.password && (
            <span className="text-red-500">{`${errors.password.message}`}</span>
            )}
            <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
                Enter your confirm password 
            </label>
            <input
                {...register("confirmPassword")}
                type={!showConfirmPassword ? "password" : "text"}
                placeholder="password!@%"
                className={`${styles.input}`}
            />
            {!showConfirmPassword ? (
                <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShowConfirmPassword(true)}
                />
            ) : (
                <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setShowConfirmPassword(false)}
                />
            )}
            </div>
            {errors.confirmPassword && (
            <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
            )}
            <br />

            <input
                type="submit"
                value="Submit"
                disabled={isSubmitting || loading}
                className={`${styles.button} mt-3`}
            />

            <br />
        </form>
      </div>
    </div>
  );
};


export default ResetPassword;


