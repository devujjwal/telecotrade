import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <div className="w-full pt-0 pb-0">
        <div className="login-page-wrapper w-full py-10">
          <div className="container-x mx-auto">
            <div className="lg:flex items-center relative">
              <div className="mx-auto lg:w-[572px] w-full bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
                <div className="w-full">
                  <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                    <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
                      Log In
                    </h1>
                    <div className="shape -mt-6">
                      <svg
                        width="172"
                        height="29"
                        viewBox="0 0 172 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5.08742C17.6667 19.0972 30.5 31.1305 62.5 27.2693C110.617 21.4634 150 -10.09 171 5.08727"
                          stroke="#FFBB38"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <form
                    className="input-area"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div className="input-item mb-5">
                      <div className="input-com w-full h-full">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          htmlFor="email"
                        >
                          Email Address*
                        </label>
                        <input
                          type="email"
                          {...register('email', {
                            required: 'Please enter email',
                            pattern: {
                              value:
                                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                              message: 'Please enter valid email',
                            },
                          })}
                          className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                          id="email"
                          autoFocus
                        ></input>
                        {errors.email && (
                          <div className="text-red-500">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="input-item mb-5">
                      <div className="input-com w-full h-full">
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          htmlFor="password"
                        >
                          Password*
                        </label>
                        <input
                          type="password"
                          {...register('password', {
                            required: 'Please enter password',
                            minLength: {
                              value: 6,
                              message: 'password is more than 5 chars',
                            },
                          })}
                          className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                          id="password"
                          autoFocus
                        ></input>
                        {errors.password && (
                          <div className="text-red-500 ">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="forgot-password-area flex justify-between items-center mb-7">
                      <div className="remember-checkbox flex items-center space-x-2.5">
                        <button
                          type="button"
                          className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
                        ></button>
                        <span className="text-base text-black">
                          Remember Me
                        </span>
                      </div>
                      <a
                        href="/forgot-password"
                        className="text-base text-qyellow"
                      >
                        Forgot Password
                      </a>
                    </div>
                    <div className="signin-area mb-3.5">
                      <div className="flex justify-center">
                        <button className="black-btn mb-6 text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center">
                          <span>Log In</span>
                        </button>
                      </div>
                    </div>
                    <div className="signup-area flex justify-center">
                      <p className="text-base text-qgraytwo font-normal">
                        Dont’t have an account ?{' '}
                        <Link href="/register">
                          <a className="ml-2 text-qblack">Register</a>
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
