import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const { Option } = Select;

interface UpdateSpecificationProps {
  visible: boolean;
  onClose: () => void;
  variantId: number; // Lấy variantId từ props
  specificationId: number; // Lấy specificationId từ props
  specName: string;
  specValue: string;
  onUpdated: () => void;
}

const UpdateSpecification: React.FC<UpdateSpecificationProps> = ({
  visible,
  onClose,
  variantId, // Lấy variantId từ props
  specificationId, // Lấy specificationId từ props
  specName,
  specValue,
  onUpdated,
}) => {
  const [form] = Form.useForm();

  const handleUpdate = async (values: any) => {
    // Kiểm tra xem variantId và specificationId có hợp lệ không
    if (!variantId || !specificationId) {
      message.error('Thông tin không hợp lệ!');
      return;
    }

    try {
      // Gọi API PUT với đúng URL và payload
      await axiosInstanceL.put(`/api/specifications/variant/${variantId}/${specificationId}`, {
        spec_name: values.spec_name,
        spec_value: values.spec_value,
        spec_group: values.spec_group,
      });

      message.success('Cập nhật thông số thành công!');
      onUpdated(); // Gọi lại hàm onUpdated sau khi cập nhật thành công
      onClose(); // Đóng modal
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Cập nhật thất bại!');
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        spec_name: specName,
        spec_value: specValue,
      });
    }
  }, [visible, specName, specValue]);

  return (
    <Modal
      title="Cập nhật thông số kỹ thuật"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          label="Tên thông số (spec_name)"
          name="spec_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên thông số!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá trị thông số (spec_value)"
          name="spec_value"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị thông số!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSpecification;
