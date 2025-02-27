import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);

  const { id: product_id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        alert('取得產品失敗');
      }
    };
    getProduct();
  }, []);

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

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <img
              className="img-fluid"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addCardItem(product_id, qtySelect)}
                type="button"
                className="btn btn-primary"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
