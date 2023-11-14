import React, { useState, useEffect, useLocation } from "react";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function ShowProduct(props) {
  // const { user } = props;
  const [user, setUser] = useState("Seller");
  const [cartList, setCartList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { productData } = location.state;
  // const productData = {
  //   id: 1,
  //   name: "상품명",
  //   price: "가격",
  //   content: "제품설명",
  //   image:
  //     "https://cdn.pixabay.com/photo/2020/08/09/11/31/business-5475283_1280.jpg",
  //   category: "Food",
  //   salesCount: "0",
  //   sellerId: "1233",
  // };

  useEffect(() => {
    // console.log(location);
    console.log(productData);
    if (user === "User") getCartList();

    if (user === "Admin" || user === "Seller") getProductList();
  }, []);

  /*  상품 정보 가져오기
  const getProductData = () => {
    fetch("http://localhost:3300/products")
      .then((response) => response.json())
      .then((jsonData) => {
        // item.id === props.productsId
        const product = jsonData.find((item) => item.id === 1);
        console.log(product);
      });
  }; */

  // 장바구니 리스트
  const getCartList = () => {
    fetch("http://localhost:3300/users")
      .then((response) => response.json())
      .then((jsonData) => {
        // localStorage.getItem(key) // localStorage.getItem("userId")
        const cartList = jsonData.find((item) => item.id === "1234").cartList;
        console.log(cartList);
        setCartList(cartList);
      });
  };

  // 판매 물품 리스트
  const getProductList = () => {
    fetch(`http://localhost:3300/sellers`)
      .then((response) => response.json())
      .then((jsonData) => {
        const cartList = jsonData.find(
          (item) => item.id === productData.sellerId
        ).productList;
        setCartList(cartList);
        console.log(cartList);
      });
  };

  // 장바구니 담기
  const addCart = () => {
    if (user === "Guest") {
      const guestCartList =
        JSON.parse(sessionStorage.getItem("guestCartList")) || [];
      if (guestCartList.includes(productData.id)) {
        return alert("이미 장바구니에 있는 상품입니다");
      }
      sessionStorage.setItem(
        "guestCartList",
        JSON.stringify([...guestCartList, productData.id])
      );
      alert("장바구니에 추가되었습니다.");
      return;
    }
    // user === "User"
    if (cartList.includes(productData.id)) {
      return alert("이미 장바구니에 있는 상품입니다");
    }

    setCartList((prevCartList) => {
      const updatedCartList = [...prevCartList, productData.id];

      // ${localStorage.getItem("userId")}
      fetch(`http://localhost:3300/users/1234`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartList: updatedCartList }),
      }).then((response) => {
        console.log(response);
      });
      console.log(updatedCartList);
      return updatedCartList;
    });

    alert("장바구니에 추가되었습니다.");
  };

  const buy = () => {
    if (user === "Guest") {
      return alert("로그인 후 이용가능합니다.");
    }
    if (cartList.includes(productData.id)) {
      return;
    }
    setCartList((prevCartList) => {
      const updatedCartList = [...prevCartList, productData.id];

      // ${localStorage.getItem("userId")}
      fetch(`http://localhost:3300/users/1234`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartList: updatedCartList }),
      }).then((response) => {
        console.log(response);
      });
      return updatedCartList;
    });
  };

  const deleteProduct = () => {
    /* eslint-disable */
    if (!confirm("상품을 삭제하시겠습니까?")) {
      return;
    }
    setCartList((prevProductList) => {
      const updatedProductList = prevProductList.filter(
        (item) => item !== productData.id
      );
      // ${localStorage.getItem("userId")}
      fetch("http://localhost:3300/sellers/1233", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ productListList: updatedProductList }),
      }).then((response) => {
        console.log(response);
      });
      return updatedProductList;
    });

    // 지금 얘가 PRODUCT에 접근해서 삭제하는데 COMMENT랑 ORDER도 사라짐
    fetch(`http://localhost:3300/products/${productData.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    }).then((response) => {
      console.log(response);
    });

    navigate(`/ProductList?category=${productData.category}`);
  };

  return (
    <Container>
      <Row>
        <Col>navigate(`/ProductList?category=${productData.category}`);</Col>
      </Row>
      <Row className="justify-content-center mt-5 mb-3">
        <Col xs="auto" sm="auto" md="auto" lg="auto">
          <img className="img-fluid" src={productData.image} alt="" />
        </Col>
      </Row>
      <Row className=" justify-content-between">
        <Col xs="7" sm="8" md="9" lg="9">
          <strong style={{ fontSize: "35px", fontWeight: 10 }}>
            {productData.name}
          </strong>
        </Col>
        <Col className="d-flex  align-items-end justify-content-end">
          <strong style={{ fontSize: "35px", fontWeight: 10 }}>
            {productData.price}
          </strong>
          <span
            className="pb-1"
            style={{ fontSize: "25px", marginLeft: "3px" }}
          >
            원
          </span>
        </Col>
      </Row>
      <Row className="justify-content-end mt-2">
        {user === "Guest" || user === "User" ? (
          // Guest, User
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <Button
              variant="outline-success"
              onClick={addCart}
              style={{ marginRight: "5px" }}
            >
              장바구니 담기
            </Button>

            <Button variant="outline-success" onClick={buy}>
              {user === "Guest" ? (
                <Link to="/Login" className="text-decoration-none text-reset">
                  구매하기
                </Link>
              ) : (
                <Link to="/MyCart" className="text-decoration-none text-reset">
                  구매하기
                </Link>
              )}
            </Button>
          </Col>
        ) : (
          // Seller, Admin
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <Button variant="outline-success" style={{ marginRight: "5px" }}>
              수정
            </Button>
            <Button variant="outline-success" onClick={deleteProduct}>
              삭제
            </Button>
          </Col>
        )}
      </Row>
      <Row className=" ml-5 mt-5 mb-3">
        <Col style={{ fontSize: "20px", wordWrap: "break-word" }}>
          {productData.content}
        </Col>
      </Row>
    </Container>
  );
}