import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';
import axios from 'axios';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    true;
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Head>
        <title>
          {title
            ? `${title} - Telecommunication Trading`
            : 'Telecommunication Trading Germany Company'}
        </title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header className="fixed z-50 w-full">
          <nav className="flex h-24 items-center justify-between bg-white px-4 shadow-md">
            <div className="cursor-pointer px-4 " onClick={sidebarOpenHandler}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="h-5 w-5 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </div>
            <Link href="/">
              <a className="text-lg font-bold">Teleco Trade</a>
            </Link>
            <form
              onSubmit={submitHandler}
              className="w-full max-w-3xl mx-auto  hidden justify-center md:flex h-14 shadow-900"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 flex h-full w-full focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="flex h-full min-w-[143px] items-center justify-center rounded-lg  rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5 mr-1"></SearchIcon> Search
              </button>
            </form>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
          <div className="fixed top-0 left-0 z-40 h-full w-[20rem] translate-x-[-20rem] bg-gray-300 p-10  duration-300 ease-in-out dark:bg-gray-800">
            <div className="mb-2 flex justify-between">
              <h2>Shopping By Categories</h2>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <ul>
              {categories.map((category) => (
                <Link key={category} href={`/search?category=${category}`}>
                  <a>
                    <li onClick={sidebarCloseHandler}>{category}</li>
                  </a>
                </Link>
              ))}
            </ul>
          </div>
        </header>
        <main className="container m-auto mt-28 px-5">{children}</main>
        <footer className="flex h-10 items-center justify-center shadow-inner">
          <p>All rights reserved. Telecommunication Trading Germany Company.</p>
        </footer>
      </div>
    </>
  );
}
