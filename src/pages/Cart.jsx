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

const Cart = () => {
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
    getCart();
  }, []);

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
    <>
      <div className="container">
        {cart.carts?.length > 0 && (
          <div>
            <div className="text-end py-3">
              <button
                onClick={removeCard}
                className="btn btn-outline-danger mt-4"
                type="button"
              >
                清空購物車
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: '150px' }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => (
                  <tr key={cartItem.id}>
                    <td>
                      <button
                        onClick={() => removeCardItem(cartItem.id)}
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                      >
                        x
                      </button>
                    </td>
                    <td>{cartItem.product.title}</td>
                    <td style={{ width: '150px' }}>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button
                            onClick={() =>
                              updateCardItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty - 1
                              )
                            }
                            disabled={cartItem.qty === 1}
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            -
                          </button>
                          <span
                            className="btn border border-dark"
                            style={{ width: '50px', cursor: 'auto' }}
                          >
                            {cartItem.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateCardItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty + 1
                              )
                            }
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                          {cartItem.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">{cartItem.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：
                  </td>
                  <td className="text-end" style={{ width: '130px' }}>
                    {cart.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={onSubmit}>
          <Input
            register={register}
            errors={errors}
            inputText="Email"
            id="email"
            type="email"
            rules={{
              required: {
                value: true,
                message: 'email 欄位必填',
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email 格式錯誤',
              },
            }}
          />
          <Input
            register={register}
            errors={errors}
            inputText="收件人姓名"
            id="name"
            type="text"
            rules={{
              required: {
                value: true,
                message: '姓名欄位必填',
              },
            }}
          />
          <Input
            register={register}
            errors={errors}
            inputText="收件人電話"
            id="tel"
            type="text"
            rules={{
              required: {
                value: true,
                message: '電話欄位必填',
              },
              pattern: {
                value: /^(0[2-8]\d{7}|09\d{8})$/,
                message: '請輸入正確電話',
              },
            }}
          />
          <Input
            register={register}
            errors={errors}
            inputText="收件人地址"
            id="address"
            type="text"
            rules={{
              required: {
                value: true,
                message: '地址欄位必填',
              },
            }}
          />

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register('message')}
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={isCartEmpty}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Cart;
