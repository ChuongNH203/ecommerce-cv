import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

// Schema xác thực form
const schema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

// Kiểu dữ liệu form
export type FormData = yup.InferType<typeof schema>;

interface LoginFormProps {
  onSubmit: (data: FormData) => void;
  authError: string;
  onForgotPasswordClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  authError,
  onForgotPasswordClick,
}) => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <div className="rounded w-full max-w-xl p-2">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-left">
          Đăng nhập
        </h2>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Tên đăng nhập"
            validateStatus={errors.username ? "error" : ""}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="ant-input-lg w-full"
                  placeholder="Nhập tên đăng nhập"
                />
              )}
            />
          </Form.Item>

        <Form.Item
          label="Mật khẩu"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} size="large" placeholder="Mật khẩu" />
            )}
          />
        </Form.Item>

          {authError && (
            <Form.Item>
              <div className="text-red-500 text-sm">{authError}</div>
            </Form.Item>
          )}

          <Form.Item className="text-end">
            <Button type="link" onClick={onForgotPasswordClick}>
              Quên mật khẩu?
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="btn-addnew w-full text-base h-12 font-semibold"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              <span>Bạn chưa có tài khoản? </span>
              <Button type="link" onClick={() => navigate("/register")}>
                Đăng ký ngay
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
