import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  message,
} from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface UpdateVariantProps {
  variant: any | null;
  visible: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const UpdateVariant: React.FC<UpdateVariantProps> = ({ variant, visible, onClose, onUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (variant) {
      form.setFieldsValue({
        ...variant,
        price: Number(variant.price),
        weight: Number(variant.weight),
        length: variant.dimensions?.depth ?? 0,
        width: variant.dimensions?.width ?? 0,
        height: variant.dimensions?.height ?? 0,
      });
    }
  }, [variant, form]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleUpdate = async (values: any) => {
    try {
      const payload = {
        variant_name: values.variant_name,
        color: values.color,
        size: values.size,
        price: values.price,
        stock: values.stock,
        sku: values.sku,
        weight: values.weight,
        dimensions: {
          depth: values.length,
          width: values.width,
          height: values.height,
        },
      };

      await axiosInstanceL.put(`/api/variant/update/${variant?.id}`, payload);
      message.success('Cập nhật biến thể thành công!');
      onClose();
      onUpdated?.();
    } catch (error: any) {
      console.error('Lỗi cập nhật:', error);
      message.error(error?.response?.data?.message || 'Cập nhật thất bại!');
    }
  };

  return (
    <Modal
      open={visible}
      title="Cập nhật biến thể sản phẩm"
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleUpdate}>
        <Form.Item name="variant_name" label="Tên biến thể" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Màu sắc">
          <Input />
        </Form.Item>
        <Form.Item name="size" label="Kích cỡ">
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá bán">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="stock" label="Tồn kho">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="sku" label="SKU">
          <Input />
        </Form.Item>
        <Form.Item name="weight" label="Khối lượng (kg)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="length" label="Chiều sâu (cm)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="width" label="Chiều rộng (cm)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="height" label="Chiều cao (cm)">
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Cập nhật</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateVariant;
