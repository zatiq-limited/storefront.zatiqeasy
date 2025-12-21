import { NextRequest, NextResponse } from 'next/server';

// Mock products data - replace with actual database call
const mockProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 299,
    old_price: 399,
    image_url: '/demo/products/tshirt-white.jpg',
    images: [
      '/demo/products/tshirt-white-1.jpg',
      '/demo/products/tshirt-white-2.jpg'
    ],
    description: 'Comfortable 100% cotton t-shirt perfect for everyday wear',
    quantity: 50,
    category_id: 'cat1',
    category_name: 'Clothing',
    sku: 'TSH001',
    shop_id: '47366'
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Headphones',
    price: 1299,
    old_price: 1599,
    image_url: '/demo/products/headphones.jpg',
    images: [
      '/demo/products/headphones-1.jpg',
      '/demo/products/headphones-2.jpg'
    ],
    description: 'High-quality wireless headphones with active noise cancellation',
    quantity: 30,
    category_id: 'cat2',
    category_name: 'Electronics',
    sku: 'WH001',
    shop_id: '47366',
    variant_types: [
      {
        id: 'color',
        name: 'Color',
        options: [
          { id: 'black', value: 'Black' },
          { id: 'white', value: 'White' }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Running Shoes Pro',
    price: 2499,
    image_url: '/demo/products/shoes.jpg',
    images: [
      '/demo/products/shoes-1.jpg',
      '/demo/products/shoes-2.jpg'
    ],
    description: 'Professional running shoes with advanced cushioning',
    quantity: 0,
    category_id: 'cat3',
    category_name: 'Footwear',
    sku: 'RS001',
    shop_id: '47366'
  },
  {
    id: '4',
    name: 'Smart Watch Ultra',
    price: 5999,
    old_price: 6999,
    image_url: '/demo/products/smartwatch.jpg',
    description: 'Feature-rich smartwatch with health tracking',
    quantity: 15,
    category_id: 'cat2',
    category_name: 'Electronics',
    sku: 'SW001',
    shop_id: '47366'
  },
  {
    id: '5',
    name: 'Denim Jeans Classic',
    price: 899,
    image_url: '/demo/products/jeans.jpg',
    description: 'Classic fit denim jeans with stretch comfort',
    quantity: 40,
    category_id: 'cat1',
    category_name: 'Clothing',
    sku: 'DJ001',
    shop_id: '47366'
  },
  {
    id: '6',
    name: 'Leather Wallet',
    price: 399,
    image_url: '/demo/products/wallet.jpg',
    description: 'Genuine leather wallet with multiple card slots',
    quantity: 25,
    category_id: 'cat4',
    category_name: 'Accessories',
    sku: 'LW001',
    shop_id: '47366'
  }
];

// Mock categories
const mockCategories = [
  {
    id: 'cat1',
    name: 'Clothing',
    description: 'T-shirts, jeans, and more',
    image_url: '/demo/categories/clothing.jpg',
    shop_id: '47366'
  },
  {
    id: 'cat2',
    name: 'Electronics',
    description: 'Gadgets and accessories',
    image_url: '/demo/categories/electronics.jpg',
    shop_id: '47366'
  },
  {
    id: 'cat3',
    name: 'Footwear',
    description: 'Shoes and sandals',
    image_url: '/demo/categories/footwear.jpg',
    shop_id: '47366'
  },
  {
    id: 'cat4',
    name: 'Accessories',
    description: 'Wallets, belts, and more',
    image_url: '/demo/categories/accessories.jpg',
    shop_id: '47366'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;
  const { searchParams } = new URL(request.url);

  // Filter products by shop_id
  const products = mockProducts.filter(p => p.shop_id === shopId);
  const categories = mockCategories.filter(c => c.shop_id === shopId);

  // Apply query parameters
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category_id === category);
  }

  // Search products
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Return response
  return NextResponse.json({
    products: paginatedProducts,
    categories,
    pagination: {
      page,
      limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit)
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;

  try {
    const productData = await request.json();

    // Create new product
    const newProduct = {
      id: String(Date.now()),
      shop_id: shopId,
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockProducts.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}