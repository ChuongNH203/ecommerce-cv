import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import ManageSpecifications from './manage-specification';
const { Title } = Typography;
const { Option } = Select;

const SpecificationAdd = ({ onCreated }: { onCreated: () => void }) => {
  const [form] = Form.useForm();
  const [specNames, setSpecNames] = useState<string[]>([]); // Lưu tên các thông số (spec_name)
  const [specGroups, setSpecGroups] = useState<string[]>([]); // Lưu nhóm thông số (spec_group)
  const [variantId, setVariantId] = useState<string>(''); // Lưu mã biến thể (variant_id)
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined); // Lưu categoryId
  const [variantOptions, setVariantOptions] = useState<any[]>([]); // Lưu danh sách các biến thể
  const [isManageModalVisible, setIsManageModalVisible] = useState(false);

  const fetchVariants = async () => {
    try {
      const res = await axiosInstanceL.get('/api/variant/all');
      if (res.data && res.data.data) {
        setVariantOptions(res.data.data); // Lưu danh sách biến thể
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách biến thể');
      console.error('Error fetching variants: ', error);
    }
  };

  const fetchSpecData = async (variantId: string) => {
    try {
      const res = await axiosInstanceL.get(`/api/variant/${variantId}/detail`);
      if (res.data && res.data.data) {
        const variantData = res.data.data;
        const categoryId = variantData.Product?.category_id;
        setCategoryId(categoryId);

        const specRes = await axiosInstanceL.get(`/api/specifications/template/${categoryId}`);
        const specData = specRes.data.data;
        const specNamesList = specData.map((spec: any) => spec.spec_name);
        const specGroupsList = Array.from(new Set(specData.map((spec: any) => spec.spec_group))) as string[];

        setSpecNames(specNamesList);
        setSpecGroups(specGroupsList);
      } else {
        message.error('Không tìm thấy dữ liệu cho biến thể này.');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thông số');
      console.error('Error fetching spec data: ', error);
    }
  };

  const handleVariantIdChange = (value: string) => {
    setVariantId(value);
    if (value) {
      fetchSpecData(value); // Gọi API để lấy thông số khi người dùng chọn biến thể
    }
  };
  const handleCreated = () => {
    if (categoryId) {
      fetchSpecData(variantId); // Lấy lại thông số kỹ thuật mới
    }
  };
  const onFinish = async (values: any) => {
    try {
      const payload = {
        spec_name: values.spec_name,
        spec_value: values.spec_value,
        spec_group: values.spec_group || '',
      };

      await axiosInstanceL.post(`/api/specifications/variant/${variantId}`, payload);
      message.success('Đã thêm thông số kỹ thuật thành công!');
      form.resetFields();
      onCreated(); // Gọi lại hàm onCreated sau khi thêm thành công
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thêm thất bại!');
    }
  };

  useEffect(() => {
    fetchVariants(); // Lấy danh sách các biến thể khi component mount
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Button type="primary" onClick={() => setIsManageModalVisible(true)}>
        Quản lý chi tiết
      </Button>
      <Title level={4}>Thêm Thông Số Kỹ Thuật</Title>

      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mã biến thể (variant_id)"
              name="variant_id"
              rules={[{ required: true, message: 'Vui lòng chọn mã biến thể!' }]}
            >
              <Select placeholder="Chọn mã biến thể" onChange={handleVariantIdChange} value={variantId}>
                {variantOptions.map((variant) => (
                  <Option key={variant.id} value={variant.id}>{variant.variant_id}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tên thông số (spec_name)"
              name="spec_name"
              rules={[{ required: true, message: 'Vui lòng chọn tên thông số!' }]}
            >
              <Select placeholder="Chọn tên thông số">
                {specNames.map((specName, index) => (
                  <Option key={index} value={specName}>{specName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Giá trị (spec_value)"
              name="spec_value"
              rules={[{ required: true, message: 'Vui lòng nhập giá trị thông số!' }]}
            >
              <Input placeholder="VD: Gỗ sồi, 220V..." />
            </Form.Item>
          </Col>

        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Thêm thông số</Button>
        </Form.Item>

        <ManageSpecifications
          visible={isManageModalVisible}
          onClose={() => setIsManageModalVisible(false)}
          categoryId={categoryId} // Chắc chắn truyền categoryId cho modal
          onCreated={handleCreated} // Thêm prop onCreated để fetch lại dữ liệu
        />
      </Form>
    </div>
  );
};

export default SpecificationAdd;
