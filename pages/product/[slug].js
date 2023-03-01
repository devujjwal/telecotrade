import { LockOpenIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import BreadcrumbCom from '../../components/BreadcrumbCom';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { status, data: session } = useSession();
  const { product } = props;

  const productImages =
    product.images && product.images.length > 0
      ? [...new Set(product.images)]
      : [];

  const [src, setSrc] = useState(product.image);
  const changeImgHandler = (current) => {
    setSrc(current);
  };

  const { state, dispatch } = useContext(Store);

  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout childrenClasses="pt-0 pb-0" title={product.name}>
      <div className="single-product-wrapper w-full ">
        <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
          <div className="breadcrumb-wrapper w-full ">
            <div className="container-x mx-auto">
              <BreadcrumbCom
                paths={[
                  { name: 'home', path: '/' },
                  {
                    name: product.name,
                    path: `/product/${product.slug}`,
                  },
                ]}
              />
            </div>
          </div>
          <div className="w-full bg-white pb-[60px]">
            <div className="container-x mx-auto">
              <div className="product-view w-full lg:flex justify-between">
                <div
                  data-aos="fade-right"
                  className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]"
                >
                  <div className="w-full">
                    <div className="w-full h-[600px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {productImages &&
                        productImages.length > 0 &&
                        productImages.map((img, index) => (
                          <div
                            onClick={() => changeImgHandler(img)}
                            key={index}
                            className="w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer"
                          >
                            <img
                              src={img}
                              alt=""
                              className={`w-full h-full object-contain ${
                                src !== img ? 'opacity-50' : ''
                              } `}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="product-details w-full mt-10 lg:mt-0">
                    <span
                      data-aos="fade-up"
                      className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block"
                    >
                      <Link href={`/search?brand=${product.brand}`}>
                        {product.brand}
                      </Link>
                    </span>
                    <p
                      data-aos="fade-up"
                      className="text-xl font-medium text-qblack mb-4"
                    >
                      {product.name}
                    </p>

                    {status === 'loading' ? (
                      'Loading'
                    ) : session?.user ? (
                      <div
                        data-aos="fade-up"
                        className="flex space-x-2 items-center mb-7"
                      >
                        <span className="text-sm font-500 text-qgray line-through mt-2">
                          €
                          {
                            +parseFloat(
                              product.price +
                                product.price *
                                  (Math.floor(Math.random() * 0.7) + 0.1)
                            ).toFixed(3)
                          }
                        </span>
                        <span className="text-2xl font-500 text-qred">
                          €{product.price}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full my-2">
                        <Link
                          href={`/login`}
                          className="flex items-center space-x-3 text-qred text-sm"
                        >
                          <span>
                            <LockOpenIcon className="w-3 h-3" />
                          </span>
                          <span>Login to view price and place order</span>
                        </Link>
                      </div>
                    )}
                    <div
                      data-aos="fade-up"
                      className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]"
                    >
                      <div className="w-[250px] h-full flex justify-center items-center">
                        <button
                          type="button"
                          className="bg-qyellow text-sm font-semibold w-full h-full"
                        >
                          View Specifications
                        </button>
                      </div>
                      {status === 'loading' ? (
                        'Loading'
                      ) : session?.user ? (
                        <div className="flex-1 h-full">
                          <button
                            type="button"
                            onClick={addToCartHandler}
                            className="black-btn text-sm font-semibold w-full h-full"
                          >
                            Add To Cart
                          </button>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div data-aos="fade-up" className="mb-[20px]">
                      {product.category && (
                        <p className="text-[13px] text-qgray leading-7">
                          <span className="text-qblack">Category :</span>{' '}
                          {product.category}
                        </p>
                      )}
                      {product.ean && (
                        <p className="text-[13px] text-qgray leading-7">
                          <span className="text-qblack">EAN :</span>{' '}
                          {product.ean}
                        </p>
                      )}
                      {product.sku && (
                        <p className="text-[13px] text-qgray leading-7">
                          <span className="text-qblack">SKU :</span>{' '}
                          {product.sku}
                        </p>
                      )}
                      {product.properties.item_spec && (
                        <p className="text-[13px] text-qgray leading-7">
                          <span className="text-qblack">Specifications :</span>{' '}
                          {product.properties.item_spec}
                        </p>
                      )}
                      {product.properties.warranty && (
                        <p className="text-[13px] text-qgray leading-7">
                          <span className="text-qblack">Warranty :</span>{' '}
                          {product.properties.warranty}
                        </p>
                      )}
                      <p className="text-[13px] text-qgray leading-7">
                        <span className="text-qblack">Status :</span>{' '}
                        {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
