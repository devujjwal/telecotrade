import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const brands = await Product.find().distinct('brand');
  await db.disconnect();
  res.send(brands);
};

export default handler;
