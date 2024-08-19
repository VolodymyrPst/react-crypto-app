import { Layout, Select, Space, Button, Modal, Drawer } from "antd";
const { Header } = Layout;
import { useCrypto } from "../context/crypto-context";
import { useEffect, useState } from "react";
import CoinInfoModal from "./layout/CoininfoModal";
import AddAssetForm from "./layout/AddAssetForm";

const headerStyle = {
  width: "100%",
  textAlign: "center",
  color: "#fff",
  height: 60,
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#4096ff",
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [modal, setModal] = useState(false);
  const [coin, setCoin] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = (event) => {
      if (event.key == "/") {
        setSelect(true);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value) {
    setModal(true);
    setCoin(crypto.find((c) => c.id == value));
  }

  return (
    <Header style={headerStyle}>
      <Select
        open={select}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        value='pres / to open'
        style={{ width: "250" }}
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: "20px" }}
              src={option.data.icon}
              alt={option.data.label}
            />
            {option.data.label}
          </Space>
        )}
      />

      <Button type='primary' onClick={() => setDrawer(true)}>
        Add Asset
      </Button>

      <Modal
        title='Basic Modal'
        open={modal}
        onCancel={() => setModal(false)}
        footer={null}>
        <CoinInfoModal coin={coin} />
      </Modal>

      <Drawer
        width='600'
        title='Add Asset'
        onClose={() => setDrawer(false)}
        open={drawer}
        destroyOnClose>
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Header>
  );
}
