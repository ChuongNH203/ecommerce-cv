import React from "react";
import { Form, Input, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface RegisterVerifyFormProps {
  otpSent: boolean;
  onSendOtp: (data: {
    username: string;
    fullname: string;
    email: string;
    password: string;
  }) => void;
  onSubmit: (data: any) => void;
}

const RegisterVerifyForm: React.FC<RegisterVerifyFormProps> = ({
  otpSent,
  onSendOtp,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleBackClick = () => {
    navigate("/login");
  };

const handleSendOtpClick = async () => {
  try {
    const values = await form.validateFields(["username", "fullname", "email", "password"]);
    onSendOtp(values); // Chỉ gọi khi hợp lệ
  } catch (error) {
    // Không gọi nếu có lỗi, Ant Design sẽ tự hiển thị lỗi
    console.log("Form chưa hợp lệ, không gửi OTP.");
  }
};

  const validatePasswordMatch = (_: any, value: string) => {
    if (!value || value === form.getFieldValue("password")) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Mật khẩu không khớp"));
  };

  return (
    <div className="w-full max-w-xl p-4">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={handleBackClick}
        className="mb-4 -ml-28"
      >
        Đăng nhập
      </Button>

      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Đăng ký tài khoản
      </h2>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
        >
          <Input size="large" placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input size="large" placeholder="Họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input size="large" placeholder="Email" disabled={otpSent} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password size="large" placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            { validator: validatePasswordMatch },
          ]}
        >
          <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        {otpSent && (
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input size="large" placeholder="Mã OTP" />
          </Form.Item>
        )}

        {!otpSent && (
          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              onClick={handleSendOtpClick}
            >
              Gửi mã OTP
            </Button>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            disabled={!otpSent}
            className="font-semibold"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterVerifyForm;
