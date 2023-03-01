import { ShoppingCartIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../../utils/Store';
import Middlebar from './Middlebar';
import Navbar from './Navbar';
import TopBar from './TopBar';

export default function Header({ className, drawerAction }) {
  const { state } = useContext(Store);
  const { cart } = state;

  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  return (
    <header className={` ${className || ''} header-section-wrapper relative`}>
      <TopBar className="telecotrade-shop-top-bar" />
      <Middlebar className="telecotrade-shop-middle-bar lg:block hidden" />
      <div className="telecotrade-shop-drawer lg:hidden block w-full h-[60px] bg-white">
        <div className="w-full h-full flex justify-between items-center px-5">
          <div onClick={drawerAction}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <div>
            <Link href="/">
              <Image
                width="152"
                height="36"
                src="/images/logo.svg"
                alt="logo"
              />
            </Link>
          </div>
          <div className="cart relative cursor-pointer">
            <Link href="/cart">
              <span>
                <ShoppingCartIcon className="w-7 h-8"></ShoppingCartIcon>
              </span>
            </Link>
            {cartItemsCount > 0 && (
              <span className="w-[18px] h-[18px] rounded-full bg-qyellow absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px]">
                {cartItemsCount}
              </span>
            )}
          </div>
        </div>
      </div>
      <Navbar className="telecotrade-shop-nav-bar lg:block hidden" />
    </header>
  );
}
