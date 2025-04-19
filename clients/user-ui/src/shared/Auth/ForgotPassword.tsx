import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from '../../utils/styles';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '@/src/graphql/actions/forgot-password';
import toast from 'react-hot-toast';
import { error } from 'console';



const formSchema = z.object({
    email: z.string().email(),
  });

// ForgotPasswordSchema becomes {email: string} here in our case 
type ForgotPasswordSchema = z.infer<typeof formSchema>;

function ForgotPassword({setActiveState}: {setActiveState: (e: string) => void}) {

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(formSchema) });

    const [forgotPassword, { loading, data, error }] = useMutation(FORGOT_PASSWORD);

    const onSubmit = async (data: ForgotPasswordSchema) => {
        
          await forgotPassword({
            variables: {
              email: data.email
            }
          });
    };

    useEffect(() => {
        if (data) {
          toast.success(data.forgotPassword.message || "Please Check your email to reset your password");
          reset();
          setActiveState("nextStep");
        }
        if (error) {
          if(error.graphQLErrors.length > 0) {
            const message = error.graphQLErrors[0].message || "An error occurred";
            toast.error(message);
          } else if (error.networkError) {
            toast.error("A network error occurred. Please check your connection");
          } else {
            toast.error(error.message || "Something went wrong");
          }
        }
      }, [data, error, reset, setActiveState]);

    
  return (
    <div>
      <h1 className={`${styles.title}`}>Forgot your password?</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="loginmail@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <br />
        <br />
        <input
          type="submit"
          value={ loading || isSubmitting ? "Submitting..." : "Submit"}
          disabled={isSubmitting  || loading}
          className={`${styles.button} mt-3`}
        />
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Or Go Back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  )
}

export default ForgotPassword