import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Popconfirm, message, Form, Input, Empty } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface ManageVariantsProps {
  visible: boolean;
  onClose: () => void;
  productId: number; // Lấy thông tin phân loại theo productId
}

const ManageVariants: React.FC<ManageVariantsProps> = ({
  visible,
  onClose,
  productId,
}) => {
  const [variants, setVariants] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const [form] = Form.useForm();

  // Lấy thông tin các phân loại của sản phẩm
  const fetchVariants = async () => {
    try {
      const res = await axiosInstanceL.get(`/api/variant/product/${productId}`);
      setVariants(res.data.data); // Lưu thông tin phân loại
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchVariants(); // Lấy phân loại khi mở modal
    }
  }, [visible]);

  const handleAddVariant = async (values: any) => {
    try {
      await axiosInstanceL.post(`/api/variant/create`, {
        product_id: productId,
        variant_name: values.variant_name,
        // Thêm các thông số khác nếu cần
      });
      message.success('Thêm phân loại thành công!');
      fetchVariants(); // Cập nhật lại danh sách phân loại
      form.resetFields();
    } catch (error) {
      message.error('Thêm phân loại thất bại');
    }
  };

  const handleEditVariant = async (values: any) => {
    try {
      await axiosInstanceL.put(`/api/variant/update/${currentVariant.id}`, values);
      message.success('Cập nhật phân loại thành công!');
      fetchVariants(); // Cập nhật lại danh sách phân loại
      setIsEdit(false);
      setCurrentVariant(null);
    } catch (error) {
      message.error('Cập nhật phân loại thất bại');
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    try {
      await axiosInstanceL.delete(`/api/variant/delete/${variantId}`);
      message.success('Xóa phân loại thành công!');
      fetchVariants(); // Cập nhật lại danh sách phân loại
    } catch (error) {
      message.error('Xóa phân loại thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên phân loại',
      dataIndex: 'variant_name',
      key: 'variant_name',
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
              setCurrentVariant(record);
              form.setFieldsValue({ variant_name: record.variant_name });
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDeleteVariant(record.id)}
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
      title="Quản lý phân loại sản phẩm"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={isEdit ? handleEditVariant : handleAddVariant}
      >
        <Form.Item
          label="Tên phân loại"
          name="variant_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên phân loại!' }]}
        >
          <Input placeholder="VD: Màu đỏ, Kích thước L, ..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Cập nhật' : 'Thêm phân loại'}
          </Button>
        </Form.Item>
      </Form>

      {variants.length === 0 ? (
        <Empty description="Chưa có phân loại cho sản phẩm này" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={variants}
          pagination={false}
          bordered
          size="small"
        />
      )}
    </Modal>
  );
};

export default ManageVariants;
