import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, DatePicker, Select } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import dayjs from 'dayjs';

const { Option } = Select;

const VoucherAdd: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values: any) => {
    const { valid_from, valid_until } = values;
    const formattedValidFrom = dayjs(valid_from).format('YYYY-MM-DD');
    const formattedValidUntil = dayjs(valid_until).format('YYYY-MM-DD');

    const dataToSend = { ...values, valid_from: formattedValidFrom, valid_until: formattedValidUntil };

    try {
      setUploading(true);
      const response = await axiosInstanceL.post('/api/vouchers', dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data) {
        message.success('Voucher đã được tạo thành công!');
        onCreated();
      } else {
        message.error('Tạo voucher thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo voucher:', error);
      message.error('Đã xảy ra lỗi khi tạo voucher!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Mã Voucher" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}>
          <Input placeholder="Mã voucher" />
        </Form.Item>

        <Form.Item label="Số tiền giảm" name="discount_amount">
          <InputNumber min={0} placeholder="Số tiền giảm" style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item label="Ngày bắt đầu" name="valid_from" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
          <DatePicker placeholder="Chọn ngày bắt đầu" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Ngày hết hạn" name="valid_until" rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}>
          <DatePicker placeholder="Chọn ngày hết hạn" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Giới hạn sử dụng" name="usage_limit" rules={[{ required: true, message: 'Vui lòng nhập giới hạn sử dụng!' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="is_active">
          <Select defaultValue={true}>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploading}>
            Thêm voucher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VoucherAdd;
