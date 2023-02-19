import { Menu } from '@headlessui/react';
import {
  ChevronDownIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../../utils/Store';
import DropdownLink from '../DropdownLink';
import SearchBox from '../SearchBox';

export default function Middlebar({ className }) {
  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">
            <div>
              <Link href="/">
                <a>
                  <Image
                    width="152"
                    height="36"
                    src="/images/logo.svg"
                    alt="logo"
                  />
                </a>
              </Link>
            </div>
            <div className="w-[517px] h-[44px]">
              <SearchBox className="search-com" />
            </div>
            <div className="flex space-x-6 items-center">
              <div className="cart-wrapper group relative">
                <div className="cart relative cursor-pointer">
                  <Link href="/cart">
                    <a>
                      <span>
                        <ShoppingCartIcon className="w-7 h-8"></ShoppingCartIcon>
                      </span>
                    </a>
                  </Link>
                  {cartItemsCount > 0 && (
                    <span className="w-[18px] h-[18px] rounded-full bg-qyellow absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px]">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              </div>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="flex space-x-2 items-center border-l-2 border-gray-100 pl-2">
                    <UserCircleIcon className="w-7 h-7"></UserCircleIcon>
                    <div>
                      <span className="leading-none">{session.user.name}</span>
                    </div>
                    <ChevronDownIcon className="h-3 w-6"></ChevronDownIcon>
                  </Menu.Button>
                  <Menu.Items className="absolute w-[200px] right-0 origin-top-right bg-white shadow-lg z-50">
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
                  <a>
                    <div className="flex space-x-2 items-center border-l-2 border-gray-100 pl-2">
                      <UserCircleIcon className="w-12 h-12"></UserCircleIcon>
                      <div>
                        <span className="text-sm leading-none">Sign In</span>
                        <b className="block leading-none">Account</b>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
