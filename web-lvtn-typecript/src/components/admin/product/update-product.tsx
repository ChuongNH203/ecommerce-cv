import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const { Option } = Select;

interface UpdateProductProps {
  product: any | null;
  visible: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product, visible, onClose, onUpdated }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!product) return;

    // Gán giá trị vào form
    form.setFieldsValue({
      ...product,
      category_id: product.categoryDetail?.id || product.category_id,
    });

    const imageUrl = product.thumbnail?.startsWith('/')
      ? `http://localhost:3000${product.thumbnail}`
      : product.thumbnail;

    setFileList([{ uid: '-1', name: product.thumbnail, url: imageUrl }]);
  }, [product]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstanceL.get('/api/category/list');
      setCategories(res.data.data.items || []);
    } catch (err) {
      message.error('Không thể tải danh mục');
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const thumbnail = fileList.length > 0 ? fileList[0].name : '';
      const payload = { ...values, thumbnail };

      await axiosInstanceL.put(`/api/product/update/${product.id}`, payload);

      message.success('Cập nhật sản phẩm thành công!');
      onClose();
      if (onUpdated) onUpdated();
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <Modal
      open={visible}
      title="Cập nhật sản phẩm"
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleUpdate}>
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="brand" label="Thương hiệu">
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="category_id" label="Danh mục" rules={[{ required: true }]}>
          <Select placeholder="Chọn danh mục">
            {categories.map((c: any) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="discount_percentage" label="Giảm giá (%)">
          <InputNumber min={0} max={100} step={0.5} className="w-full" />
        </Form.Item>

        <Form.Item label="Ảnh đại diện (thumbnail)">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Cập nhật</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
