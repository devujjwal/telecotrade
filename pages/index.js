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
import bannerOne from '../public/images/banner1.png';
import bannerTwo from '../public/images/banner2.png';
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
      <div className="w-full mb-[60px]">
        <div className="container-x mx-auto">
          <div className="main-wrapper w-full">
            <Carousel showThumbs={false} autoPlay>
              <div>
                <Image src={bannerOne} alt="Picture of the author" />
              </div>
              <div>
                <Image src={bannerTwo} alt="Picture of the author" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
      <div className="section-wrapper w-full">
        <div className="container-x mx-auto">
          <div className=" section-title flex justify-between items-center mb-5">
            <div>
              <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none">
                Latest Products
              </h1>
            </div>
          </div>
          <div className="section-content">
            <div data-aos="fade-up" className="section-style-one">
              <div className="products-section w-full">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-2 xl:gap-[30px] gap-5">
                  {products.map((product) => (
                    <div key={product.slug} className="item">
                      <ProductItem
                        product={product}
                        key={product.slug}
                        addToCartHandler={addToCartHandler}
                      ></ProductItem>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
