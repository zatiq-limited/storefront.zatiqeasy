import React from 'react';

interface ProductCards2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=282&h=220&fit=crop&q=80',
    discount: '25% Off',
    category: 'Headphones',
    title: 'Soundcore Q30 Over-Ear Headphones',
    salePrice: '13,500',
    originalPrice: '15,000'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=282&h=220&fit=crop&q=80',
    discount: '30% Off',
    category: 'Speakers',
    title: 'Portable Bluetooth Speaker Pro',
    salePrice: '8,400',
    originalPrice: '12,000'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=282&h=220&fit=crop&q=80',
    discount: '20% Off',
    category: 'Fashion',
    title: 'Premium Cotton T-Shirt',
    salePrice: '1,600',
    originalPrice: '2,000'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=282&h=220&fit=crop&q=80',
    discount: '15% Off',
    category: 'Accessories',
    title: 'Wireless Earbuds Premium',
    salePrice: '10,200',
    originalPrice: '12,000'
  }
];

export default function ProductCards2({ settings, blocks, pageData }: ProductCards2Props) {
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
              borderRadius: '0px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 0 0 1px #E5E7EB'
            }}
            className="hover:shadow-lg"
          >
            {/* Top Half - Image Container */}
            <div 
              style={{
                width: '282px',
                height: '220px',
                position: 'relative',
                backgroundColor: '#E8E4F3'
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
                  top: '17px',
                  left: '17px',
                  backgroundColor: '#FF4757',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '16px'
                }}
              >
                {product.discount}
              </div>
            </div>

            {/* Bottom Half - Content Area */}
            <div style={{ 
              padding: '0px',
              height: '221px',
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'white'
            }}>
              {/* Category */}
              <div 
                style={{
                  fontSize: '14px',
                  color: '#3465F0',
                  fontWeight: 400,
                  lineHeight: '20px',
                  paddingTop: '18px',
                  paddingLeft: '18px',
                  paddingRight: '18px',
                  marginBottom: '8px'
                }}
              >
                {product.category}
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#181D25',
                  lineHeight: '22px',
                  paddingLeft: '18px',
                  paddingRight: '18px',
                  marginBottom: '16px',
                  minHeight: '44px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.title}
              </h3>

              {/* Prices */}
              <div style={{ 
                paddingLeft: '18px',
                paddingRight: '18px',
                marginBottom: '24px'
              }}>
                <span 
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#EF4444',
                    lineHeight: '24px'
                  }}
                >
                  {product.salePrice} BDT
                </span>
                <span 
                  style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    marginLeft: '8px',
                    fontWeight: 400,
                    lineHeight: '20px'
                  }}
                >
                  {product.originalPrice} BDT
                </span>
              </div>

              {/* Add to Cart Button */}
              <div style={{ paddingLeft: '18px', paddingRight: '18px', paddingBottom: '18px', marginTop: 'auto' }}>
                <button
                  style={{
                    width: '100%',
                    height: '48px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#3B82F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'white',
                    gap: '8px',
                    transition: 'all 0.3s',
                    lineHeight: '20px'
                  }}
                  className="hover:bg-blue-600"
                >
                  Add to Cart
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M2.5 2.5H4.16667L4.5 4.16667M5.83333 10.8333H14.1667L17.5 4.16667H4.5M5.83333 10.8333L4.5 4.16667M5.83333 10.8333L3.92262 12.7441C3.39762 13.269 3.76942 14.1667 4.51184 14.1667H14.1667M14.1667 14.1667C13.2462 14.1667 12.5 14.9129 12.5 15.8333C12.5 16.7538 13.2462 17.5 14.1667 17.5C15.0871 17.5 15.8333 16.7538 15.8333 15.8333C15.8333 14.9129 15.0871 14.1667 14.1667 14.1667ZM7.5 15.8333C7.5 16.7538 6.75381 17.5 5.83333 17.5C4.91286 17.5 4.16667 16.7538 4.16667 15.8333C4.16667 14.9129 4.91286 14.1667 5.83333 14.1667C6.75381 14.1667 7.5 14.9129 7.5 15.8333Z" 
                      stroke="white" 
                      strokeWidth="1.67" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
