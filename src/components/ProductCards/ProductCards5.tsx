import React from 'react';

interface ProductCards5Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=282&h=462&fit=crop&q=80',
    discount: '-5%',
    title: 'Chamarel Cross Front Multilit Singlet Top',
    salePrice: '630',
    originalPrice: '830'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=282&h=462&fit=crop&q=80',
    discount: '-5%',
    title: 'Elegant Floral Print Summer Dress',
    salePrice: '850',
    originalPrice: '1,100'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=282&h=462&fit=crop&q=80',
    discount: '-5%',
    title: 'Designer Embroidered Party Wear',
    salePrice: '1,250',
    originalPrice: '1,500'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=282&h=462&fit=crop&q=80',
    discount: '-5%',
    title: 'Traditional Ethnic Wear Collection',
    salePrice: '980',
    originalPrice: '1,200'
  }
];

export default function ProductCards5({ settings, blocks, pageData }: ProductCards5Props) {
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
              height: '513px',
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
            {/* Top - Image Container (462px) */}
            <div 
              style={{
                width: '282px',
                height: '462px',
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
                  top: '12px',
                  right: '12px',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#EF6C6C',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px'
                  }}
                >
                  {product.discount}
                </span>
              </div>
            </div>

            {/* Bottom - Content Area (51px) */}
            <div style={{ 
              padding: '8px 12px',
              height: '51px',
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'white',
              justifyContent: 'center'
            }}>
              {/* Title */}
              <h3 
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#181D25',
                  lineHeight: '16px',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {product.title}
              </h3>

              {/* Prices */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span 
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#EF4444',
                    lineHeight: '20px'
                  }}
                >
                  BDT {product.salePrice}
                </span>
                <span 
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    fontWeight: 400,
                    lineHeight: '16px'
                  }}
                >
                  {product.originalPrice} tk
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
