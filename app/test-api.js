// Test API calls
import { fetchShopProfile, fetchShopInventories, fetchShopCategories } from '@/lib/api/shop';

console.log('Testing API calls...');

// Test shop profile
fetchShopProfile({ shop_id: 47366 })
  .then(data => {
    console.log('Shop Profile:', data?.shop_name);
  })
  .catch(err => {
    console.error('Shop API Error:', err);
  });

// Test products
fetchShopInventories({ shop_uuid: '02b6fa2d-9fe6-42bd-af7b-0df413e9fc10' })
  .then(data => {
    console.log('Products:', data?.length || 'No products');
  })
  .catch(err => {
    console.error('Products API Error:', err);
  });