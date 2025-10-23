import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  // 로딩스피너 state
  const [loading, setLoading] = useState(true);

  // 로딩스피너 추가
  useEffect(() => {
    setLoading(true); // fetching전에 true로 set
    dispatch(getProductList({ name })).then(() => setLoading(false)); // fetching후 false로 변경
  }, [dispatch, name]);

  return (
    <Container>
      <Row>
        {/* 로딩스피너 추가 */}
        {loading ? (
          <div className="centered-spinner">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={6} xs={6} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>No registered products available!</h2>
            ) : (
              <h2>No products found matching '{name}'.</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
