import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Popconfirm, message, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const ManageCategory = ({ visible, onClose }: any) => {
  const [categories, setCategories] = useState<any[]>([]); // List of categories
  const [isEdit, setIsEdit] = useState(false); // To check if we are editing
  const [currentCategory, setCurrentCategory] = useState<any>(null); // Store the category being edited
  const [form] = Form.useForm();

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const res = await axiosInstanceL.get('/api/category/list');
      setCategories(res.data.data.items || []); // Assuming API returns items in data
    } catch (error) {
      message.error('Lỗi khi tải danh mục!');
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch categories when modal is opened
  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  // Add new category
  const handleAddCategory = async (values: any) => {
    try {
      await axiosInstanceL.post('/api/category/create', values);
      message.success('Thêm danh mục thành công!');
      fetchCategories();
      form.resetFields();
    } catch (error) {
      message.error('Thêm danh mục thất bại!');
    }
  };

  // Edit category
  const handleEditCategory = async (values: any) => {
    try {
      await axiosInstanceL.put(`/api/category/update/${currentCategory.id}`, values);
      message.success('Cập nhật danh mục thành công!');
      fetchCategories();
      setIsEdit(false);
      setCurrentCategory(null);
    } catch (error) {
      message.error('Cập nhật danh mục thất bại!');
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axiosInstanceL.delete(`/api/category/delete/${categoryId}`);
      message.success('Xóa danh mục thành công!');
      fetchCategories();
    } catch (error) {
      message.error('Xóa danh mục thất bại!');
    }
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setCurrentCategory(record);
              form.setFieldsValue({ name: record.name,  description: record.description || '', });
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Quản lý danh mục"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={isEdit ? handleEditCategory : handleAddCategory}>
        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
          <Input placeholder="VD: Điện thoại, Máy tính..." />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
        >
          <Input.TextArea placeholder="VD: Các loại điện thoại thông minh, laptop..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            {isEdit ? 'Cập nhật' : 'Thêm danh mục'}
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        pagination={false}
        bordered
        size="small"
      />
    </Modal>
  );
};

export default ManageCategory;
