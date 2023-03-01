/* eslint-disable @next/next/no-img-element */
import { LockOpenIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProductItem({ product, addToCartHandler }) {
  const { status, data: session } = useSession();
  return (
    <div
      className="product-card-one w-full h-full bg-white relative group overflow-hidden"
      style={{ boxShadow: '0px 15px 64px 0px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="product-card-img w-full h-[300px] p-2">
        <Link
          href={`/product/${product.slug}`}
          className="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64"
        >
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="product-image"
          />
        </Link>
      </div>
      <div className="product-card-details px-[30px] pb-[30px] relative">
        <Link href={`/product/${product.slug}`}>
          <p className="title mb-0 text-[12px] font-400 text-qblack line-clamp-2 hover:text-blue-600">
            {product.brand}
          </p>
        </Link>
        <Link href={`/product/${product.slug}`}>
          <p className="title mb-2 text-[15px] font-600 text-qblack leading-[24px] line-clamp-2 hover:text-blue-600">
            {product.name}
          </p>
        </Link>
        {status === 'loading' ? (
          'Loading'
        ) : session?.user ? (
          <p className="price">
            <span className="main-price text-qgray line-through font-600 text-[18px]">
              €
              {
                +parseFloat(
                  product.price +
                    product.price * (Math.floor(Math.random() * 0.7) + 0.1)
                ).toFixed(3)
              }
            </span>
            <span className="offer-price text-qred font-600 text-[18px] ml-2">
              €{product.price}
            </span>
          </p>
        ) : (
          <div className="w-full mt-2">
            <Link
              href={`/login`}
              className="flex items-center space-x-3 text-qred text-sm"
            >
              <span>
                <LockOpenIcon className="w-3 h-3" />
              </span>
              <span>Login to view price</span>
            </Link>
          </div>
        )}

        {status === 'loading' ? (
          'Loading'
        ) : session?.user ? (
          <div className="w-full mt-2">
            <button
              type="button"
              className="yellow-btn"
              onClick={() => addToCartHandler(product)}
            >
              <div className="flex items-center space-x-3 p-2">
                <span>
                  <ShoppingBagIcon className="w-5 h-5" />
                </span>
                <span>Add To Cart</span>
              </div>
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
