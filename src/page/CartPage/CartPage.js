import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    //카트리스트 불러오기
    dispatch(getCartList());
  }, [dispatch]);

  // 재고가 0개 이상인 아이템만 카트페이지에 보이도록 수정 (원래는 주문시 재고가 0이되어도 카트아이템이랑, order summary에 같이 보였음)
  // const filteredCartList = cartList.filter(
  //   (item) => item.productId.stock[item.size] > 0
  // );

  // // Calculate the updated totalPrice based on filteredCartList
  // const filteredTotalPrice = filteredCartList.reduce(
  //   (acc, item) => acc + item.productId.price * item.qty,
  //   0
  // );

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {cartList.length > 0 ? (
            cartList.map((item) => (
              <CartProductCard item={item} key={item._id} />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>Your cart is empty.</h2>
              <div>Please add items!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
