import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { useSearchParams } from 'react-router-dom';

const { Title } = Typography;

const VariantAdd = ({ onCreated }: { onCreated: () => void }) => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get('productId') || '0');

  useEffect(() => {
    if (productId) {
      form.setFieldsValue({ product_id: productId });
    }
  }, [productId]);

  const onFinish = async (values: any) => {
    try {
      const res = await axiosInstanceL.post('/api/variant/create', values);
      message.success('Thêm biến thể thành công!');
      form.resetFields();
      form.setFieldsValue({ product_id: productId }); // giữ lại product_id
      onCreated(); // Gọi lại hàm onCreated sau khi thêm thành công
    } catch (err: any) {
      console.error('Lỗi khi thêm biến thể:', err);
      message.error(err?.response?.data?.message || 'Lỗi không xác định!');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Title level={4}>Tạo mới biến thể sản phẩm</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="ID sản phẩm (product_id)"
              name="product_id"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tên biến thể (variant_name)"
              name="variant_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="VD: Bàn gấp chân cao" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Màu sắc" name="color">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Kích cỡ" name="size">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="SKU" name="sku">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Giá bán (price)" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" addonAfter="đ" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Tồn kho (stock)" name="stock" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Khối lượng (weight)" name="weight">
              <InputNumber min={0} className="w-full" addonAfter="kg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Chiều sâu (depth)" name={['dimensions', 'depth']}>
              <InputNumber min={0} className="w-full" addonAfter="cm" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Chiều rộng (width)" name={['dimensions', 'width']}>
              <InputNumber min={0} className="w-full" addonAfter="cm" />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item label="Chiều cao (height)" name={['dimensions', 'height']}>
              <InputNumber min={0} className="w-full" addonAfter="cm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Thêm biến thể
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VariantAdd;
