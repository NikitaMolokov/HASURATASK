import { useState } from "react";
import ModalComponent from "../components/ModalComponent";
import PageComponent from "../components/PageComponent";
// god i hate weird import issues in production deployment
const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleChangeModal = () => setShowModal(!showModal);

  return (
    <>
      <ModalComponent open={showModal} onClick={handleChangeModal} />
      <PageComponent onClick={handleChangeModal} />
    </>
  );
};

export default Home;
