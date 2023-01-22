import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import bannerOne from '../public/images/banner1.jpg';
import Image from 'next/image';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <Carousel showThumbs={false} autoPlay>
        <div>
          <Image src={bannerOne} alt="Picture of the author" />
        </div>
        <div>
          <Image src={bannerOne} alt="Picture of the author" />
        </div>
      </Carousel>
      <h2 className="h2 my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({ item_spec: 'EU Spec' })
    .lean()
    .sort()
    .limit(8);
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
