import {
  Select,
  Space,
  Divider,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Result,
} from "antd";
import { useRef, useState } from "react";
import { useCrypto } from "./../../context/crypto-context";
import Coininfo from "./Coininfo";

export default function AddAssetForm({ onClose }) {
  const [coin, setCoin] = useState(null);
  const [submit, setSubmit] = useState(false);
  const { crypto, addAsset } = useCrypto();
  const [form] = Form.useForm();
  const assetRef = useRef();

  if (submit) {
    return (
      <Result
        status='success'
        title='New asset added!'
        subTitle={`Added ${assetRef.current.amount} of ${assetRef.current.id} by price ${assetRef.current.price}`}
        extra={[
          <Button type='primary' key='console' onClick={onClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  if (!coin) {
    return (
      <Select
        style={{
          width: "100%",
        }}
        onSelect={(v) => setCoin(crypto.find((c) => c.id == v))}
        value='pres / to open'
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
    );
  }

  function onFinish(values) {
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date?.$d ?? new Date(),
    };
    assetRef.current = newAsset;
    setSubmit(true);
    addAsset(newAsset);
  }

  function handleAmountChange(value) {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  }

  function handlePriceChange(value) {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  }

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 10 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        price: +coin.price.toFixed(2),
      }}
      onFinish={onFinish}>
      <Coininfo coin={coin} />
      <Divider />
      <Form.Item
        label='Amount'
        name='amount'
        rules={[
          {
            required: true,
            type: "number",
            message: "Please input your amount!",
          },
        ]}>
        <InputNumber style={{ width: "100%" }} onChange={handleAmountChange} />
      </Form.Item>

      <Form.Item label='Price' name='price'>
        <InputNumber style={{ width: "100%" }} onChange={handlePriceChange} />
      </Form.Item>

      <Form.Item label='Date & Time' name='date'>
        <DatePicker style={{ width: "100%" }} showTime />
      </Form.Item>

      <Form.Item label='Total' name='total'>
        <InputNumber disabled style={{ width: "100%" }} value={form.total} />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
}
