import { Row, Col } from 'antd';
import { CreditCard, DollarSign, Wallet, ShieldCheck, Banknote } from 'lucide-react'; // Các icon thay thế

const Footer = () => (
  <>
    <div className="bg-dark text-white bg-gray-950 py-8 pl-32">
      <Row gutter={24} className="px-8">
        <Col span={6}>
          <h3 className="text-lg font-semibold">VỀ CHÚNG TÔI</h3>
          <div className="w-56 text-xs text-gray-400 font-semibold mt-3">
           <p className="text-sm">Chúng tôi cung cấp các sản phẩm chất lượng cao với cam kết mang đến sự hài lòng tuyệt đối cho khách hàng, đảm bảo sự tiện lợi và trải nghiệm mua sắm tốt nhất.</p>
            <div className="mt-2">
              <div className="flex items-center text-sm mb-2">
                <span className="mr-2 ">📍</span> 1734 Stonecoal Road
              </div>
              <div className="flex items-center text-sm mb-2">
                <span className="mr-2 ">📞</span> +84-387118144
              </div>
              <div className="flex items-center text-sm mb-2">
                <span className="mr-2 ">✉️</span> nguyenhoangchuong7506@gmail.com
              </div>
            </div>
          </div>
        </Col>

        <Col span={6}>
          <h3 className="text-lg font-semibold">DANH MỤC</h3>
          <ul className="text-sm text-gray-400 font-semibold mt-3">
            <li className="mb-3">Ưu đãi nóng</li>
            <li className="mb-3">Laptop</li>
            <li className="mb-3">Smartphone</li>

            <li className="mb-3">Phụ kiện</li>
          </ul>
        </Col>

        <Col span={6}>
          <h3 className="text-lg font-semibold">THÔNG TIN</h3>
          <ul className="text-sm text-gray-400 font-semibold mt-3">
            <li className="mb-3">Về chúng tôi</li>
            <li className="mb-3">Liên hệ</li>
            <li className="mb-3">Chính sách bảo mật</li>
            <li className="mb-3">Đơn hàng và trả hàng</li>
            <li className="mb-3">Điều khoản & Điều kiện</li>
          </ul>
        </Col>

        <Col span={6}>
          <h3 className="text-lg font-semibold">DỊCH VỤ</h3>
          <ul className="text-sm text-gray-400 font-semibold mt-3 ">
            <li className="mb-3">Tài khoản của tôi</li>
            <li className="mb-3">Xem giỏ hàng</li>
            <li className="mb-3">Danh sách yêu thích</li>
            <li className="mb-3">Theo dõi đơn hàng</li>
            <li className="mb-3">Trợ giúp</li>
          </ul>
        </Col>
      </Row>
    </div>

    <div className='bg-dark text-gray-300 bg-gray-900'>
      {/* Biểu tượng thanh toán - thay react-icons bằng lucide-react */}
      <div className="flex justify-center gap-4 pt-8">
        <CreditCard className="text-white w-6 h-6" />
        <DollarSign className="text-white w-6 h-6" />
        <Wallet className="text-white w-6 h-6" />
        <ShieldCheck className="text-white w-6 h-6" />
        <Banknote className="text-white w-6 h-6" />
      </div>

      {/* Bản quyền footer */}
      <div className="mt-8 text-center text-xs pb-10">
        <p>Copyright ©2025 </p>
      </div>
    </div>
  </>
);

export default Footer;
