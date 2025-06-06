import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);

  const addCardItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      alert('商品已加入購物車');
    } catch (error) {
      alert('加入購物車失敗');
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert('取得產品失敗');
      } finally {
      }
    };
    getProducts();
  }, []);

  return (
    <div className="container">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <img
                  className="object-fit-cover"
                  src={product.imageUrl}
                  alt={product.title}
                  style={{ width: '200px' }}
                />
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價 {product.origin_price} 元</del>
                <div className="h5">特價 {product.origin_price}元</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-outline-secondary"
                  >
                    查看更多
                  </Link>
                  <button
                    onClick={() => addCardItem(product.id, 1)}
                    type="button"
                    className="btn btn-outline-danger"
                  >
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
