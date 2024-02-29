import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import info from "./assets/infographic-img2.png"
import info2 from "./assets/infographic-img.png"
// import wipro from "./assets/wiprologo-kXmF--621x414@LiveMint.webp"
// import HCL from "./assets/HCL-1-2.jpg";
// import altran from "./assets/download (1).jpg";
// import logo from "./assets/logo.webp"

const Home = () => {
  return (
    <div >
      <Row className="justify-content-center">
        <Col md={8} className="text-center" style={{marginTop:"100px"}}>
        <h1 className="display-1">Welcome to Online Assessment</h1>
          <h6>
            Are you an individual looking to test your own knowledge? We've got
            you covered.
          </h6>
          <h6>
            Whether you're a student, a professional, or a lifelong learner,
            join us today and start your journey towards success!
          </h6>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <p className="lead">
            Driven by technology disruptions and a raging pandemic, global
            majors in the hi-tech industry are looking to scale and outcompete
            rivals by outsourcing critical pieces of development work to
            innovative design services partners. Large design services companies
            are unable to build a high quality pool of resources with specialized
            skills due to their large overheads and previous generation financial
            models. As a result, they can only subcontract and act as a distribution
            channel for niche, specialized smaller firms such as that have built
            enduring supply chains at the right cost.
          </p>

          <p className="lead">
            Since inception,Expert teams have successfully taped out tens of
            complex SoCs in various domains and industry segments for major
            semiconductor and technology businesses worldwide. Our engineers are
            extremely comfortable working across a variety of technology nodes,
            tools and flows, design tools and techniques, and are skilled at
            handing off designs without surprises.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Image  src={info} fluid style={{marginLeft:"100px"}}/>
        </Col>
        <Col md={6}>
          <Image src={info2} fluid style={{marginRight:"70px"}}/>
        </Col>
      </Row>

      {/* <div>
      <h1 style={{textAlign:"center",fontFamily:"inherit"}}>Our Clients</h1>
      <Carousel>
      <Carousel.Item>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={4}>
              <img src={wipro} className="w-100 rounded" alt="wipro" />
            </Col>
            <Col xs={12} md={4}>
              <img src={HCL} className="w-100 rounded" alt="HCL" />
            </Col>
            <Col xs={12} md={4}>
              <img src={logo} className="w-100 rounded" alt="logo" />
            </Col>
          </Row>
        </Container>
      </Carousel.Item>

      <Carousel.Item>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={4}>
              <img src={altran} className="w-100 rounded" alt="altran" />
            </Col>
            <Col xs={12} md={4}>
              <img src={wipro} className="w-100 rounded" alt="wipro" />
            </Col>
            <Col xs={12} md={4}>
              <img src={HCL} className="w-100 rounded" alt="HCL" />
            </Col>
          </Row>
        </Container>
      </Carousel.Item>

      <Carousel.Item>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={4}>
              <img src={logo} className="w-100 rounded" alt="logo" />
            </Col>
            <Col xs={12} md={4}>
              <img src={wipro} className="w-100 rounded" alt="wipro" />
            </Col>
            <Col xs={12} md={4}>
              <img src={HCL} className="w-100 rounded" alt="HCL" />
            </Col>
          </Row>
        </Container>
      </Carousel.Item>
    </Carousel>
      </div> */}
    </div>
  );
};

export default Home;
