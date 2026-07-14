import React, { useState } from 'react';
import { Form, InputNumber, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface ImageAddProps {
  onCreated: () => void; // Callback khi thêm hình ảnh thành công
}

const ImageAdd: React.FC<ImageAddProps> = ({ onCreated }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Xử lý khi người dùng submit form
  const onFinish = async (values: any) => {
    if (fileList.length === 0) {
      return message.warning('Vui lòng chọn ít nhất 1 ảnh!');
    }

    const formData = new FormData();
    formData.append('productId', values.product_id);

    // Thêm các file vào FormData
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      setUploading(true);
      await axiosInstanceL.post('/api/product/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Thêm hình ảnh thành công!');
      setFileList([]);

      // Gọi lại fetchImages để làm mới danh sách hình ảnh
      onCreated();
    } catch (error) {
      console.error('Lỗi khi tải ảnh:', error);
      message.error('Thêm hình ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  // Xử lý thay đổi trong Upload component
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="ID sản phẩm"
          name="product_id"
          rules={[{ required: true, message: 'Vui lòng nhập ID sản phẩm!' }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Tải lên hình ảnh"
          name="image_url"
          rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Chặn upload tự động
            maxCount={10}
            multiple
          >
            {fileList.length < 10 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={uploading}
          >
            Thêm hình ảnh
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ImageAdd;
