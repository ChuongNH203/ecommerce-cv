import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Typography,
  Row,
  Col,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import ManageCategory from './manage-category';  // Import ManageCategory component

const { Title } = Typography;
const { Option } = Select;

interface ProductAddProps {
  onProductAdded?: () => void;
}

const ProductAdd: React.FC<ProductAddProps> = ({ onProductAdded }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isManageCategoryModalVisible, setIsManageCategoryModalVisible] = useState(false);  // State for managing category modal visibility

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstanceL.get('/api/category/list');
        setCategories(res.data.data.items || []);
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
        message.error('Không thể tải danh mục');
      }
    };
    fetchCategories();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const thumbnail = fileList.length > 0 ? fileList[0].name : '';
      const images = fileList.map((file) => file.name);

      const payload = {
        ...values,
        thumbnail,
        images,
      };

      await axiosInstanceL.post('/api/product/create', payload);
      message.success('Đã thêm sản phẩm thành công!');
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      message.error('Thêm sản phẩm thất bại');
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Open Manage Category Modal
  const handleManageCategoryClick = () => {
    setIsManageCategoryModalVisible(true);
  };

  // Close Manage Category Modal
  const handleManageCategoryClose = () => {
    setIsManageCategoryModalVisible(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">


      <Button className='bg-lime-200 text-lime-800 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2 hover:bg-lime-300 hover:text-lime-900'  onClick={handleManageCategoryClick}>Quản lý danh mục</Button> {/* Manage Category Button */}
      <Title level={4}>Tạo mới sản phẩm</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input placeholder="VD: Bàn học sinh thông minh" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Thương hiệu" name="brand">
              <Input placeholder="VD: IKEA, Xiaomi..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
              <Select placeholder="Chọn danh mục">
                {categories.map((category: any) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Giảm giá (%)" name="discount_percentage">
              <InputNumber
                min={0}
                max={100}
                step={0.5}
                className="w-full"
                addonAfter="%"
                placeholder="VD: 10"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <Input.TextArea rows={3} placeholder="Chi tiết sản phẩm, công dụng..." />
            </Form.Item>
          </Col>

        </Row>

        <Form.Item>
          <Button className='bg-green-300 text-green-950 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2' htmlType="submit" icon={<PlusOutlined />}>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>

      {/* Manage Category Modal */}
      <ManageCategory
        visible={isManageCategoryModalVisible}
        onClose={handleManageCategoryClose}
      />
    </div>
  );
};

export default ProductAdd;
