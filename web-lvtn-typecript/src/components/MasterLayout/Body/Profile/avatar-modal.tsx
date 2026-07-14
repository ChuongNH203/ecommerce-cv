import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface AvatarModalProps {
  visible: boolean;
  avatarUrl: string;
  onClose: () => void;
  onAvatarSelect: (file: File) => void;
  onAvatarRemove: () => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ visible, avatarUrl, onClose, onAvatarSelect, onAvatarRemove }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    // Kiểm tra nếu tệp là ảnh
    if (file && file.type.startsWith('image/')) {
      setSelectedAvatar(file);
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      message.error('Vui lòng chọn đúng định dạng ảnh!');
    }
  };

  const handleUpload = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar); // Truyền file lên component cha
      onClose(); // Đóng modal
    }
  };
  const handleRemoveAvatar = () => {
    onAvatarRemove(); // Call parent to remove avatar
    setImagePreview(null); // Clear preview image
    onClose(); // Close modal
  };
  return (
    <Modal
      visible={visible}
      title="Chọn ảnh mới"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Đóng</Button>,
        <Button key="submit" type="primary" onClick={handleUpload}>
          Chọn ảnh
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center">
        <div className="mb-4">
            <img 
              src={imagePreview || avatarUrl} 
              alt="" 
              className="w-32 h-32 object-cover rounded-full" 
            />
        </div>
        <div className="text-lg font-semibold text-gray-800">Chọn ảnh mới</div>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('Vui lòng chọn đúng định dạng ảnh!');
            }
            return isImage;
          }}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
                {/* Display "Delete Avatar" button if avatar exists */}
                {avatarUrl || imagePreview ? (
          <Button
            style={{ marginTop: '15px', borderRadius: '5px', padding: '10px 20px' }}
            onClick={handleRemoveAvatar}
          >
            Xóa ảnh
          </Button>
        ) : null}
      </div>
    </Modal>
  );
};

export default AvatarModal;
