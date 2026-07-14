import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, DatePicker, Select } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import dayjs from 'dayjs';

interface UserAddProps {
  onCreated: () => void; // Callback khi thêm người dùng thành công
}

const UserAdd: React.FC<UserAddProps> = ({ onCreated }) => {
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      // Chuyển đổi ngày sinh sang định dạng YYYY-MM-DD
      const formattedDateOfBirth = values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : '';

      // Cập nhật lại values với ngày sinh đã được định dạng
      const dataToSend = { ...values, date_of_birth: formattedDateOfBirth };

      setUploading(true);

      // Gọi API để tạo người dùng
      const response = await axiosInstanceL.post('/api/users', dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        message.success('Người dùng đã được tạo thành công!');
        onCreated(); // Gọi lại fetchUsers để làm mới danh sách người dùng
      } else {
        message.error('Tạo người dùng thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      message.error('Đã xảy ra lỗi khi tạo người dùng!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Form layout="vertical" onFinish={onFinish}>
        {/* Tên người dùng */}
        <Form.Item
          label="Tên người dùng"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        {/* Mật khẩu */}
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        {/* Họ và tên */}
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
        >
          <Input placeholder="example@example.com" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10,12}$/, message: 'Số điện thoại không hợp lệ!'}
          ]}
        >
          <Input placeholder="0987654321" />
        </Form.Item>

        {/* Ngày sinh */}
        <Form.Item
          label="Ngày sinh"
          name="date_of_birth"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} />
        </Form.Item>

        {/* Giới tính */}
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </Form.Item>

        {/* Vai trò */}
        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="user">Người dùng</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploading}>
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserAdd;
