// components/Auth/ForgotPasswordModal.tsx
import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (email: string, otp: string) => Promise<void>;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  onSendOtp,
  onVerifyOtp,
}) => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return message.error("Vui lòng nhập email");
    setLoading(true);
    try {
      await onSendOtp(email);
      setStep("otp");
    } catch (err) {
      // lỗi đã xử lý ở page cha
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return message.error("Vui lòng nhập mã OTP");
    setLoading(true);
    try {
      await onVerifyOtp(email, otp);
    } catch (err) {
      // lỗi đã xử lý ở page cha
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onClose();
        setStep("email");
        setEmail("");
        setOtp("");
      }}
      footer={null}
      destroyOnClose
      title={step === "email" ? "Nhập Email" : "Nhập Mã OTP"}
      maskClosable={false}
    >
      {step === "email" ? (
        <>
          <Input
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            type="primary"
            block
            className="mt-4"
            onClick={handleSendOtp}
            loading={loading}
          >
            Gửi mã OTP
          </Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <Button
            type="primary"
            block
            className="mt-4"
            onClick={handleVerifyOtp}
            loading={loading}
          >
            Xác thực OTP
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
