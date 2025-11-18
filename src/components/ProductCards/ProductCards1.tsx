import React from 'react';

interface ProductCards1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=282&h=220&fit=crop&q=80',
    discount: '25% Off',
    category: 'Watches',
    title: 'New Smartwatch from Series 8',
    subtitle: 'Black Sports Band - Regular.',
    salePrice: '5,500',
    originalPrice: '8,000'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=282&h=220&fit=crop&q=80',
    discount: '30% Off',
    category: 'Smartwatch',
    title: 'Apple Watch Series 7',
    subtitle: 'GPS + Cellular - Stainless Steel.',
    salePrice: '12,500',
    originalPrice: '18,000'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=282&h=220&fit=crop&q=80',
    discount: '20% Off',
    category: 'Headphones',
    title: 'Premium Wireless Headphones',
    subtitle: 'Noise Cancelling - Black Edition.',
    salePrice: '4,800',
    originalPrice: '6,000'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=282&h=220&fit=crop&q=80',
    discount: '15% Off',
    category: 'Audio',
    title: 'Bluetooth Speaker Pro',
    subtitle: 'Portable - Waterproof Design.',
    salePrice: '3,400',
    originalPrice: '4,000'
  }
];

export default function ProductCards1({ settings, blocks, pageData }: ProductCards1Props) {
  const products = settings?.products || defaultProducts;

  return (
    <div 
      style={{
        width: '1440px',
        margin: '0 auto',
        padding: '40px 0'
      }}
    >
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        {products.map((product: any) => (
          <div 
            key={product.id}
            style={{
              width: '282px',
              height: '441px',
              backgroundColor: 'white',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            className="hover:shadow-xl"
          >
            {/* Top Half - Image Container */}
            <div 
              style={{
                width: '100%',
                height: '220px',
                position: 'relative',
                backgroundColor: '#F5F5F5'
              }}
            >
              <img 
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Discount Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#FF4757',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {product.discount}
              </div>
            </div>

            {/* Bottom Half - Content Area */}
            <div style={{ padding: '16px', height: '221px', display: 'flex', flexDirection: 'column' }}>
              {/* Category */}
              <div 
                style={{
                  fontSize: '14px',
                  color: '#3B82F6',
                  marginBottom: '8px',
                  fontWeight: 500
                }}
              >
                {product.category}
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1F2937',
                  marginBottom: '4px',
                  lineHeight: '1.4',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {product.title}
              </h3>

              {/* Subtitle */}
              <p 
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}
              >
                {product.subtitle}
              </p>

              {/* Prices */}
              <div style={{ marginBottom: '16px' }}>
                <span 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#EF4444'
                  }}
                >
                  {product.salePrice} BDT
                </span>
                <span 
                  style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    marginLeft: '8px'
                  }}
                >
                  {product.originalPrice} BDT
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                style={{
                  width: '100%',
                  height: '44px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1F2937',
                  gap: '8px',
                  transition: 'all 0.3s',
                  marginTop: 'auto'
                }}
                className="hover:bg-gray-50"
              >
                Add to Cart
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
