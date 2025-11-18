import React from 'react';

interface ProductCards7Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=282&h=306&fit=crop&q=80',
    discount: '-13%',
    title: 'Loft-style lamp 120×80 cm',
    salePrice: '1400.00',
    originalPrice: '1600.00',
    colors: ['#8B7355', '#E27D60', '#C0C0C0']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=282&h=306&fit=crop&q=80',
    discount: '-13%',
    title: 'Modern Tripod Floor Lamp',
    salePrice: '1800.00',
    originalPrice: '2100.00',
    colors: ['#2C2C2C', '#D4AF37', '#FFFFFF']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1543198126-a8189d1f0d7c?w=282&h=306&fit=crop&q=80',
    discount: '-13%',
    title: 'Minimalist Table Lamp Set',
    salePrice: '2200.00',
    originalPrice: '2500.00',
    colors: ['#1A1A1A', '#B87333', '#E5E5E5']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=282&h=306&fit=crop&q=80',
    discount: '-13%',
    title: 'Designer Arc Floor Lamp',
    salePrice: '1650.00',
    originalPrice: '1900.00',
    colors: ['#4A4A4A', '#CD7F32', '#F5F5F5']
  }
];

export default function ProductCards7({ settings, blocks, pageData }: ProductCards7Props) {
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
              height: '474px',
              backgroundColor: 'white',
              borderRadius: '0px',
              overflow: 'visible',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {/* Top - Image Container (306px) */}
            <div 
              style={{
                width: '282px',
                height: '306px',
                position: 'relative',
                backgroundColor: '#EFEFEF',
                marginBottom: '16px'
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
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: '16px'
                }}
              >
                {product.discount}
              </div>
            </div>

            {/* Bottom - Content Area */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'white'
            }}>
              {/* Color Options */}
              <div style={{ 
                display: 'flex',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {product.colors.map((color: string, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: index === 0 ? '2px solid #4A5568' : '1px solid #D1D5DB',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                ))}
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#1F2937',
                  lineHeight: '20px',
                  marginBottom: '8px'
                }}
              >
                {product.title}
              </h3>

              {/* Prices */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <span 
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1F2937',
                    lineHeight: '24px'
                  }}
                >
                  BDT {product.salePrice}
                </span>
                <span 
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    lineHeight: '20px'
                  }}
                >
                  BDT {product.originalPrice}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  border: 'none',
                  borderRadius: '24px',
                  backgroundColor: '#2D3748',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1A202C'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2D3748'}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
