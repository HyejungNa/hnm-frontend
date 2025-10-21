import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateQty,
  deleteCartItem,
  getCartQty,
} from "../../../features/cart/cartSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // 재고 데이터를 가져와 선택된 사이즈의 재고 수량만큼 dropdown 생성
  const stock = { ...item.productId.stock }; // 상품의 각 사이즈별 재고정보 복사 e.g. { S: 3, M: 5, L: 2 }
  const stockCount = stock[item.size]; // 현재 선택된 사이즈에 대한 실제 재고 수량 가져오기

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    // 카트에 있는 아이템 삭제후 -> 카트안에 있는 아이템 총갯수 업데이트하기
    dispatch(deleteCartItem(id)).then(() => {
      dispatch(getCartQty());
    });
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={3} xs={12}>
          <img
            src={item.productId.image}
            width={112}
            alt="product"
            style={{ cursor: "pointer" }}
            onClick={() => showProduct(item.productId._id)}
          />
        </Col>
        <Col md={9} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div className="cart-item-price">
            ${currencyFormat(item.productId.price)}
          </div>
          <div className="cart-size-text">Size: {item.size}</div>
          <div>
            Quantity:
            <Form.Select
              onChange={(event) =>
                handleQtyChange(item._id, event.target.value)
              }
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              {/* 바로 밑하드코딩대신 사이즈별 남아있는 재고 수량만큼 dropdown 생성함 : stockCount값만큼 수량옵션 생성*/}
              {/* <에러케이스>  1. 카트에 넣고 그사이에 누가구매시 재고가 0이되어도 카트에 보여짐, 2.카트에 넣을당시 3개였다가 그사이 누가구매해서 수량이 1개가남으면 카트아이템 수량이 자동으로 유저허락없이 1개로 바뀜*/}
              {[...Array(stockCount)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
              {/* 위코드사용시 에러나서 하드코딩한것 */}
              {/* <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option> */}
            </Form.Select>
          </div>
          <div className="total-price">
            Total: ${currencyFormat(item.productId.price * item.qty)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
