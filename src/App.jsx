import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useForm } from 'react-hook-form';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Input = ({ register, errors, inputText, id, type, rules }) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor={id} className="form-label">
          {inputText}
        </label>
        <input
          id={id}
          type={type}
          className={`form-control ${errors[id] && 'is-invalid'}`}
          placeholder={`請輸入${inputText}`}
          {...register(id, rules)}
        />

        {errors[id] && (
          <p className="text-danger my-2">{errors?.[id]?.message}</p>
        )}
      </div>
    </>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);

  const [cart, setCart] = useState({});
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
      setIsCartEmpty(res.data.data.carts?.length === 0);
    } catch (error) {
      alert('取得購物車資訊失敗');
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
    getCart();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

  const addCardItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      alert('加入購物車失敗');
    }
  };

  const removeCard = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert('清空購物車失敗');
    }
  };

  const removeCardItem = async (cartItem_id) => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
      getCart();
    } catch (error) {
      alert('刪除品項失敗');
    }
  };

  const updateCardItem = async (cartItem_id, product_id, qty) => {
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      alert('更新品項失敗');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });

  const resetForm = () => {
    reset({
      email: '',
      name: '',
      tel: '',
      address: '',
      message: '',
    });
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    checkout(userInfo);
  });

  const checkout = async (data) => {
    try {
      axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      await removeCard();
      resetForm();
      getCart();
      alert('已成功送出訂單');
    } catch (error) {
      alert('結帳有誤，請洽服務人員');
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        <div
          ref={productModalRef}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{' '}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
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
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => addCardItem(tempProduct.id, qtySelect)}
                  type="button"
                  className="btn btn-primary"
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
