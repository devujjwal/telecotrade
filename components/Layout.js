import Head from 'next/head';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Drawer from './Drawer';
import Footer from './Footers';
import Header from './Headers';

export default function Layout({ title, children, childrenClasses }) {
  const [drawer, setDrawer] = useState(false);
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

      <ToastContainer position="bottom-center" autoClose="500" limit={1} />

      <Drawer open={drawer} action={() => setDrawer(!drawer)} />
      <div className="w-full overflow-x-hidden">
        <Header drawerAction={() => setDrawer(!drawer)} />
        <div className={`w-full  ${childrenClasses || 'pt-[30px] pb-[60px]'}`}>
          {children && children}
        </div>
        <Footer />
      </div>
    </>
  );
}
