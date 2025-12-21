import { NextRequest, NextResponse } from 'next/server';

// Mock shop data - replace with actual database call
const mockShops: Record<string, any> = {
  '47366': {
    id: '47366',
    name: 'Zatiq Demo Shop',
    description: 'A beautiful demo store showcasing the Basic theme',
    logo: '/demo-logo.png',
    currency: 'BDT',
    email: 'demo@zatiq.com',
    phone: '+8801234567890',
    banner_message: '🎉 Welcome to our demo store! Free shipping on orders over ৳1000',
    social_links: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    theme_config: {
      theme: 'basic',
      enable_buy_now_on_product_card: true,
      singleProductTheme: false
    },
    metadata: {
      settings: {
        shop_settings: {
          enable_product_image_download: true
        }
      }
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;

  // Find shop in mock data
  const shop = mockShops[shopId];

  if (!shop) {
    return NextResponse.json(
      { error: 'Shop not found' },
      { status: 404 }
    );
  }

  // Return shop data
  return NextResponse.json(shop);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;

  try {
    const body = await request.json();

    // Update shop in mock data (in real app, update database)
    mockShops[shopId] = {
      ...mockShops[shopId],
      ...body,
      id: shopId
    };

    return NextResponse.json(mockShops[shopId]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
}