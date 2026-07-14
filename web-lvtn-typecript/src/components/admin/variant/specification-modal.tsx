import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Typography, message } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const { Title } = Typography;
const { Option } = Select;

interface SpecificationListModalProps {
  variantId: number;
  categoryId: number;
  onClose: () => void;
}

interface Specification {
  id: number;
  spec_name: string;
  spec_value?: string;
}

const SpecificationListModal: React.FC<SpecificationListModalProps> = ({ variantId, categoryId, onClose }) => {
  const [specs, setSpecs] = useState<Specification[]>([]);
  const [templates, setTemplates] = useState<Specification[]>([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res2 = await axiosInstanceL.get(`/api/specifications/template/${categoryId}`);
      setTemplates(res2.data.data);

      try {
        const res1 = await axiosInstanceL.get(`/api/specifications/variant/${variantId}`);
        setSpecs(res1.data.data);
      } catch (err1) {
        // Nếu không có thông số kỹ thuật, vẫn để specs rỗng để hiển thị form dựa vào templates
        setSpecs([]);
      }
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu thông số');
    }
  };

  useEffect(() => {
    fetchData();
  }, [variantId, categoryId]);

  const handleAddSpec = async (values: any) => {
    try {
      await axiosInstanceL.post(`/api/specifications/variant/${variantId}`, values);
      message.success('Thêm thông số thành công!');
      form.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Thêm thất bại');
    }
  };

  const existingNames = specs.map(s => s.spec_name?.toLowerCase());
  const availableTemplates = templates.filter(t => !!t.spec_name && !existingNames.includes(t.spec_name.toLowerCase()));

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Title level={4}>Thông số kỹ thuật của biến thể #{variantId}</Title>}
    >


      <Form layout="vertical" form={form} onFinish={handleAddSpec}>
        <Form.Item
          label="Tên thông số (spec_name)"
          name="spec_name"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn hoặc nhập"
            showSearch
            allowClear
            onChange={(val) => form.setFieldValue('spec_name', val)}
          >
            {availableTemplates.map((t) => (
              <Option key={t.id} value={t.spec_name}>{t.spec_name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá trị (spec_value)"
          name="spec_value"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>


        <Form.Item>
          <Button type="primary" htmlType="submit">Thêm thông số</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SpecificationListModal;
