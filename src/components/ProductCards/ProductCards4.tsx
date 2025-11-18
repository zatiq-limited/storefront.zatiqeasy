import React, { useState } from 'react';

interface ProductCards4Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=282&h=297&fit=crop&q=80',
    badge: 'New',
    title: 'Logitech F710 Wireless Gamepad',
    description: 'Cut the cord and enjoy the freedom gaming without wires.',
    price: '500'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=282&h=297&fit=crop&q=80',
    badge: 'New',
    title: 'Sony PlayStation DualSense',
    description: 'Experience haptic feedback and adaptive triggers.',
    price: '1,200'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=282&h=297&fit=crop&q=80',
    badge: 'New',
    title: 'Xbox Elite Wireless Controller',
    description: 'Pro-level precision with interchangeable components.',
    price: '2,500'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=282&h=297&fit=crop&q=80',
    badge: 'New',
    title: 'Nintendo Switch Pro Controller',
    description: 'Premium gaming experience with motion controls.',
    price: '1,800'
  }
];

export default function ProductCards4({ settings, blocks, pageData }: ProductCards4Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
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
              height: '481px',
              backgroundColor: '#F5F5F5',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            className="hover:shadow-lg"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Top - Image Container (297px) */}
            <div 
              style={{
                width: '282px',
                height: '297px',
                position: 'relative',
                backgroundColor: 'white'
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
              {/* New Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1ABC9C',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px'
                  }}
                >
                  {product.badge}
                </span>
              </div>
            </div>

            {/* Bottom - Content Area (184px) */}
            <div style={{ 
              padding: '24px 20px 32px 20px',
              height: '184px',
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: '#F5F5F5'
            }}>
              {/* Title */}
              <h3 
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#3D3D3D',
                  lineHeight: '24px',
                  marginBottom: '12px',
                  minHeight: '48px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.title}
              </h3>

              {/* Description */}
              <p 
                style={{
                  fontSize: '14px',
                  color: '#ABABAB',
                  lineHeight: '20px',
                  marginBottom: '16px',
                  minHeight: '40px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.description}
              </p>

              {/* Price */}
              <p 
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#F16565',
                  lineHeight: '28px'
                }}
              >
                BDT {product.price}
              </p>
            </div>

            {/* Full Card Hover Overlay with Buttons */}
            {hoveredId === product.id && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(128, 128, 128, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '0 18px',
                  borderRadius: '8px',
                  zIndex: 5
                }}
              >
                {/* Add to Cart Button */}
                <button
                  style={{
                    width: '100%',
                    height: '48px',
                    border: '1px solid #3B82F6',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#3B82F6',
                    transition: 'all 0.3s',
                    lineHeight: '20px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  style={{
                    width: '100%',
                    height: '48px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#3B82F6',
                    transition: 'all 0.3s',
                    lineHeight: '20px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
