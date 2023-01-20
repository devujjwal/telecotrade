import Product from '../../models/Product';
import db from '../../utils/db';
import axios from 'axios';

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const handler = async (req, res) => {
  try {
    axios.defaults.baseURL = 'https://restful.mobileshop.bz';
    axios.defaults.headers.common['Authorization'] = process.env.AUTH_KEY;

    const response = await axios.get('/getStock', {
      params: { lang_id: 0, price_drop: 0 },
    });

    if (response.data.stock.length > 0 && response.data.error === 0) {
      const products = response.data.stock.map((item) => ({
        id: item.id,
        name: item.model,
        slug: slugify(item.properties.full_name),
        category: item.category,
        cat_name: item.cat_name,
        image: item.image,
        images: item.images,
        price: item.price,
        price_2_year: item.price_2_year,
        brand: item.name,
        in_stock: item.in_stock,
        countInStock: item.in_stock,
        color: item.color,
        sku: item.sku,
        warehouse: item.warehouse,
        exp_delivery: item.exp_delivery,
        delivery_date: item.delivery_date,
        exp_available: item.exp_available,
        ean: item.ean,
        properties: item.properties,
      }));
      await db.connect();
      await Product.deleteMany();
      await Product.insertMany(products);
      await db.disconnect();
      res.send({ message: 'Products updated successfully' });
    } else {
      res.send({ message: 'Products not updated' });
    }
  } catch (error) {
    console.log('Error', error);
    res.send({ message: error });
  }
};

export default handler;
