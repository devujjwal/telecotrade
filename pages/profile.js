import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import Layout from '../components/Layout';
import PageTitle from '../components/PageTitle';

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      toast.success('Profile updated successfully');
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <div className="w-full bg-white pb-[60px]">
        <div className="w-full">
          <PageTitle
            title="Update Profile"
            breadcrumb={[
              { name: 'home', path: '/' },
              { name: 'profile', path: '/profile' },
            ]}
          />
        </div>
        <div className="w-full mt-[23px]">
          <div className="container-x mx-auto">
            <div className="w-full mb-[30px]">
              <div className="relative w-full overflow-x-auto"></div>
              <form
                className="input-area"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                  <div className="input-com w-full h-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                      id="name"
                      autoFocus
                      {...register('name', {
                        required: 'Please enter name',
                      })}
                    />
                    {errors.name && (
                      <div className="text-red-500">{errors.name.message}</div>
                    )}
                  </div>

                  <div className="input-com w-full h-full">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                      id="email"
                      {...register('email', {
                        required: 'Please enter email',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                          message: 'Please enter valid email',
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="text-red-500">{errors.email.message}</div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                  <div className="input-com w-full h-full">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                      type="password"
                      id="password"
                      {...register('password', {
                        required: 'Please enter password',
                        minLength: {
                          value: 6,
                          message: 'password is more than 5 chars',
                        },
                      })}
                    />
                    {errors.password && (
                      <div className="text-red-500 ">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="input-com w-full h-full">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 dark:shadow-sm-light"
                      type="password"
                      id="confirmPassword"
                      {...register('confirmPassword', {
                        required: 'Please re-enter password',
                        validate: (value) => value === getValues('password'),
                        minLength: {
                          value: 6,
                          message: 'confirm password is more than 5 chars',
                        },
                      })}
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-500 ">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                    {errors.confirmPassword &&
                      errors.confirmPassword.type === 'validate' && (
                        <div className="text-red-500 ">
                          Password do not match
                        </div>
                      )}
                  </div>
                </div>
                <div className="signin-area mb-3">
                  <div className="flex justify-center">
                    <button className="black-btn text-sm text-white w-[490px] h-[50px] font-semibold flex justify-center bg-purple items-center">
                      <span>Update Profile</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

ProfileScreen.auth = true;
