import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";

const { Title, Text } = Typography;

interface ResetPasswordFormProps {
  email: string;
  onSubmit: (newPassword: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email, onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setError("");
    onSubmit(newPassword);
  };

  return (
    <div className="rounded w-full max-w-xl p-2">
      <Title level={3} className="mb-6 text-gray-800">
        Đặt lại mật khẩu
      </Title>
      <Text className="block mb-4 text-gray-600">
        Email: <strong>{email}</strong>
      </Text>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu mới"
          validateStatus={error && !newPassword ? "error" : ""}
        >
          <Input.Password
            size="large"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          validateStatus={error && !confirmPassword ? "error" : ""}
          help={error}
        >
          <Input.Password
            size="large"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 text-base font-semibold"
          >
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
