import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { status, data: session } = useSession();
  const { product } = props;
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
    <Layout title={product.name}>
      <div className="py-2 font-500 text-blue">
        <Link href="/">Back to Products</Link>
      </div>
      <div className="grid md:grid-cols-2 md:gap-10 rounded border bg-white shadow-sm p-5 border-border-200">
        <div className="relative p-5 flex w-auto h-[600px] cursor-pointer items-center justify-center border border-qgray-border">
          <img src={product.image} alt={product.name} objectFit="contain"></img>
        </div>
        <div className="product-details w-full mt-10 lg:mt-0">
          <Link href={`/search?query=${product.brand}`}>
            <a className="text-slate-500 hover:text-blue-600 text-xs font-normal uppercase tracking-wider mb-2 inline-block">
              {product.brand}
            </a>
          </Link>
          <p className="text-xl font-medium text-qblack mb-4">{product.name}</p>
          {status === 'loading' ? (
            'Loading'
          ) : session?.user ? (
            <div className="text-2xl font-bold">€{product.price}</div>
          ) : (
            <Link href={`/login`}>
              <a className="text-slate-500 text-xs font-normal uppercase tracking-wider mb-2 inline-block">
                Login to place order & view price
              </a>
            </Link>
          )}
          <div>
            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">Category :</span> {product.category}
            </p>

            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">EAN :</span> {product.ean}
            </p>

            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">SKU :</span> {product.sku}
            </p>

            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">Specifications :</span>{' '}
              {product.properties.item_spec}
            </p>

            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">Warranty :</span>{' '}
              {product.properties.warranty}
            </p>

            <p className="text-[13px] text-qgray leading-7">
              <span className="text-qblack">Status :</span>{' '}
              {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
            </p>
          </div>
          {status === 'loading' ? (
            'Loading'
          ) : session?.user ? (
            <div className="mt-6 flex flex-col items-center md:mt-6 lg:flex-row">
              <div className="mt-5 mb-3 w-full lg:mb-0 lg:max-w-[300px]">
                <button
                  onClick={addToCartHandler}
                  className="flex w-full items-center justify-center rounded default-button py-4 px-5 text-sm transition-colors duration-300"
                >
                  <span className="font-semibold">Add To Cart</span>
                </button>
              </div>
              <span className="flex whitespace-nowrap text-base text-body lg:ml-7 cursor-pointer items-center justify-center font-bold">
                View Specifications
              </span>
            </div>
          ) : (
            <span className="flex whitespace-nowrap text-base text-body cursor-pointer font-bold mt-5">
              View Specifications
            </span>
          )}
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
