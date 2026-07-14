import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Space,
  Typography,
  message,
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const OrderAdd = () => {
  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = (values: any) => {
    console.log('Dữ liệu đơn hàng:', values);
    console.log('Hình ảnh:', fileList);
    message.success('Đã thêm đơn hàng thành công!');
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Title level={4}>Tạo mới đơn hàng</Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Space direction="horizontal" size="large" wrap>
          <Form.Item
            label="Mã đơn hàng"
            name="orderCode"
            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
          >
            <Input placeholder="ORD001" />
          </Form.Item>

          <Form.Item
            label="Khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input placeholder="Triệu Thanh Phú" />
          </Form.Item>

          <Form.Item
            label="Mô tả đơn hàng"
            name="orderDescription"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả đơn hàng!' }]}
          >
            <Input.TextArea placeholder="Ghế làm việc Zuno, Bàn ăn gỗ Theresa" rows={3} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Giá tiền"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              addonAfter="VNĐ"
            />
          </Form.Item>
        </Space>

        <Form.Item label="Hình ảnh sản phẩm">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Không upload lên server ngay lập tức
            multiple
          >
            {fileList.length < 8 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Thêm đơn hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderAdd;
