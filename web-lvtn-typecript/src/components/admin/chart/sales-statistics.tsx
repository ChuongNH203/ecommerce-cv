import React, { useEffect, useState } from 'react';
import { Spin, Card, Row, Col, Statistic, Table, DatePicker, Button, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
const BASE_URL = "http://localhost:3000";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesStatistics: React.FC = () => {
  const [salesData, setSalesData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const fetchStatistics = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const response = await axiosInstanceL.get('/api/product/sales-statistics', {
        params: startDate && endDate ? { startDate, endDate } : {}
      });
      setSalesData(response.data);
      setIsChartReady(true);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê bán hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstanceL.get('/api/orders/all');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchOrders();
  }, []);

  const handleDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates && dateStrings[0] && dateStrings[1]) {
      setDateRange([dateStrings[0], dateStrings[1]]);
    } else {
      setDateRange(null);
    }
  };

  const handleFilterClick = () => {
    if (dateRange) {
      fetchStatistics(dateRange[0], dateRange[1]);
    } else {
      fetchStatistics();
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);

  const statusTranslation: { [key in 'Pending' | 'Processing' | 'Shipping' | 'Completed' | 'Cancelled']: string } = {
    'Pending': 'Chờ xử lý',
    'Processing': 'Đang xử lý',
    'Shipping': 'Đang giao hàng',
    'Completed': 'Hoàn thành',
    'Cancelled': 'Đã hủy',
  };

  const columns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'User',
      key: 'user',
      render: (user: any) => user?.full_name || 'N/A',
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'orderItems',
      key: 'product_name',
      render: (orderItems: any[]) => orderItems.map((item, index) => (
        <div key={index}>{item?.product_variant?.Product?.name || 'N/A'}</div>
      )),
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'orderItems',
      key: 'product_image',
      render: (orderItems: any[]) => orderItems.map((item, index) => (
        <div key={index}>
          <img
            src={`${BASE_URL}${item?.product_variant?.Product?.thumbnail}` || ''}
            alt="product-thumbnail"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        </div>
      )),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (text: number) => formatCurrency(text),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status: string) => statusTranslation[status as keyof typeof statusTranslation] || 'N/A',
    },
      {
    title: 'Ngày Đặt Hàng',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
  },
  ];

  const salesByCategoryBarConfig = {
    labels: salesData.salesByCategory?.map((item: any) => item.categoryName) || [],
    datasets: [{
      label: 'Doanh Thu',
      data: salesData.salesByCategory?.map((item: any) => item.totalSales) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

const handleClearFilter = () => {
  setDateRange(null);
  fetchStatistics(); // Gọi lại API không có filter
};

  if (loading) return <Spin indicator={<LoadingOutlined />} />;

  return (
    <div>
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Lọc thống kê theo ngày tạo đơn hàng">
            <Space>
              <RangePicker onChange={handleDateChange} placeholder={['Từ ngày', 'Đến ngày']}/>
              <Button
                style={{ backgroundColor: '#52c41a', color: '#fff', border: 'none' }}
                onClick={handleFilterClick}
              >
                Lọc
              </Button>
              <Button onClick={handleClearFilter}>Bỏ lọc</Button>
            </Space>
          </Card>
          
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Tổng Doanh Thu" value={formatCurrency(salesData.totalSales)} /></Card></Col>
        <Col span={8}><Card><Statistic title="Số Đơn Hàng" value={salesData.totalOrders} /></Card></Col>
        <Col span={8}><Card><Statistic title="Sản Phẩm Bán Chạy Nhất" value={salesData.bestSellingProduct} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}><Card title="Doanh Thu Theo Loại Sản Phẩm (Biểu Đồ Cột)">{isChartReady && <Bar data={salesByCategoryBarConfig} />}</Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}><Card title="Danh Sách Đơn Hàng"><Table dataSource={orders} columns={columns} rowKey="id" /></Card></Col>
      </Row>
    </div>
  );
};

export default SalesStatistics;
