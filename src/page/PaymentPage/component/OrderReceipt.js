import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({ cartList, totalPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">Order Summary</h3>
      <ul className="receipt-list">
        {cartList.length > 0 &&
          cartList.map((item, index) => (
            <li key={index}>
              <div className="display-flex space-between">
                <div>{item.productId.name}</div>

                {/* 아이템 하나당 가격 */}
                <div>$ {currencyFormat(item.productId.price * item.qty)}</div>
              </div>
            </li>
          ))}
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>$ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {/* 카트가 비어있다면 결제하기 버튼은 숨겨주기 */}
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          Proceed to Checkout
        </Button>
      )}

      <div>
        {/* 가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다. */}
        Prices and shipping costs are not confirmed until you've reached the
        checkout.
        <div>
          <br />
          {/* 30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불 */}
          30 days for exchange and returns. Our delivery partner is working hard
          to ensure you receive your items as quickly as possible, but due to
          the recent lockdowns please be advised that delays may occur.
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
