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
                <div>${currencyFormat(item.productId.price * item.qty)}</div>
              </div>
            </li>
          ))}
      </ul>
      <div className="display-flex space-between receipt-total">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>${currencyFormat(totalPrice)}</strong>
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

      <div className="order-description">
        {/* 가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다. */}
        <p>Pricing and shipping costs are finalized during checkout.</p>

        <p>
          Our 30-day return policy applies. Return shipping fees and unclaimed
          package charges may apply.
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
