import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { div } from "framer-motion/client";
import styles from "../../utils/styles";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../graphql/actions/register.action";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8characters long!"),
  phone_number: z
    .number()
    .min(10, "Phone number must be at least 11 characters!"),
});

type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({ setActiveState }: { setActiveState: (e: string) => void }) => {

  const [registerUserMutation, { loading, error, data }] = useMutation(REGISTER_USER);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({ resolver: zodResolver(formSchema) });

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: SignUpSchema) => {
    try {
      const response = await registerUserMutation({
        variables: data
      });
      console.log(response);
      localStorage.setItem("activation_token", response.data.register.activation_token);
      toast.success("please check your email to activate your account");
      reset();
      setActiveState("Verification");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>SignUp with Becodemy</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mb-3">
          <label className={`${styles.label}`}>Enter your Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="johndoe**"
            className={`${styles.input}`}
          />
        </div>
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
        <div className="w-full relative mt-3">
          <label className={`${styles.label}`}>Enter your Phone Number</label>
          <input
            {...register("phone_number", { valueAsNumber: true })}
            type="number"
            placeholder="+8801*******"
            className={`${styles.input}`}
          />
          {errors.phone_number && (
            <span className="text-red-500 block mt-1">
              {`${errors.phone_number.message}`}
            </span>
          )}
        </div>
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
            <AiOutlineEye className="absolute bottom-3 right-2 z-1 cursor-pointer" size={20} onClick={() => setShowPassword(false)} />
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div>
          <input
            type="submit"
            value="Sign Up"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />

        <h5 className="text-center pt-4 font-Poppins text-[16px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3"
        >
          <FcGoogle size={30} className="cursor-pointer mr-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  )
}

export default Signup