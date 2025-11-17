import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const name = query.get("name");
  const category = query.get("category");
  const page = query.get("page") || 1;

  // 로딩스피너 state
  const [loading, setLoading] = useState(true);

  // 상품리스트 가져오기(들어오자마자 보여주기 - useEffect사용) + 로딩스피너 추가
  useEffect(() => {
    setLoading(true); // fetching전에 true로 set
    dispatch(getProductList({ name, category, page })).then(() =>
      setLoading(false)
    ); // fetching후 false로 변경
  }, [dispatch, name, category, page]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (category) params.set("category", category);
    params.set("page", selectedPage);
    navigate(`/?${params.toString()}`);
  };

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

      <ReactPaginate
        previousLabel="< previous"
        nextLabel="next >"
        breakLabel="..."
        pageCount={totalPageNum || 1}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        forcePage={page ? Number(page) - 1 : 0}
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        activeClassName="active"
      ></ReactPaginate>
    </Container>
  );
};

export default LandingPage;
