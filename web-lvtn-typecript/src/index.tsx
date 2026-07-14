import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'
import 'font-awesome/css/font-awesome.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CartProvider } from './components/MasterLayout/Body/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WishlistProvider } from './components/MasterLayout/Body/Wishlist/wishlist-context';
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

