import React, { useEffect, useState } from 'react';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';
import OrderHeader from './tracking/order-header';
import OrderStatusTimeline from './tracking/order-status-timeline';
import ShippingAddress from './tracking/shipping-address';
import DeliveryStatus from './tracking/delivery-status';
import ProductDetails from './tracking/product-details';
import ActionButton from './tracking/action-buttons';
import ProductReview from './tracking/product-preview';

const OrderTracking: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const orderId = new URLSearchParams(window.location.search).get('orderId'); // Lấy orderId từ URL query
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstanceL.get(`/api/order-items/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        setOrder(response.data.order); // Lưu thông tin đơn hàng
        setOrderItems(response.data.orderItems); 
        setOrder({
          ...response.data.order,
          discount_amount: response.data.discount_amount || 0, 
        });
        const checkReviewResponse = await axiosInstanceL.get(`/api/review/check-review`, {
          params: {
            order_id: orderId,
            variant_id: response.data.orderItems[0].product_variant.id
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });

        if (checkReviewResponse.status === 200) {
          setHasReviewed(true); 
        }
        const paymentResponse = await axiosInstanceL.get(`/api/payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            order_id: orderId, 
          },
        });
        console.log("Payment Response:", paymentResponse.data); 
        const paymentStatus = paymentResponse.data.payments[0]?.payment_status || 'Chưa có thông tin';
        setPaymentStatus(paymentStatus);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng này.</div>;
  }

  const shippingAddress = order.Address || null;
  const shippingMethod = order || null;
    const handleOpenReview = () => {
    setIsReviewOpen(true); // Mở cửa sổ đánh giá
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false); // Đóng cửa sổ đánh giá
  };


    const isOrderCompleted = order.order_status === 'Completed';
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <OrderHeader orderId={order.id} orderStatus={order.order_status} />
      <OrderStatusTimeline currentStatus={order.order_status} />
{isOrderCompleted ? (
  hasReviewed ? (
    <div className="bg-green-500 text-white text-center p-4 rounded-lg mb-4">
      Cảm ơn bạn đã đánh giá!
    </div>
  ) : (
    <ActionButton onOpenReview={handleOpenReview} />
  )
) : null}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <ProductReview onClose={handleCloseReview} product={orderItems[0]?.product_variant?.Product} variantId={orderItems[0]?.product_variant.id} orderId={order.id} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShippingAddress address={shippingAddress} />
        <DeliveryStatus currentStatus={order.order_status} order={shippingMethod}  />
      </div>
       <ProductDetails orderItems={orderItems} totalAmount={order.total_amount} 
        shippingMethod={order.shipping_method} discountAmount={order.discount_amount} 
        paymentMethod={order.payment_method} paymentStatus={paymentStatus}/>
    </div>
  );
};

export default OrderTracking;
