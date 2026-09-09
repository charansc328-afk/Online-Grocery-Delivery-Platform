// Image fallbacks using openly usable generic high-quality images from Unsplash Source or standard reliable sources.

export const getFallbackImage = (category, name) => {
  const cat = (category || '').toLowerCase();
  
  if (cat.includes('vegetable')) return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80'; // generic veggies
  if (cat.includes('fruit')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80'; // generic fruits
  if (cat.includes('dairy') || cat.includes('egg')) return 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80'; // dairy/milk
  if (cat.includes('baker') || cat.includes('bread')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'; // bakery
  if (cat.includes('snack')) return 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&q=80'; // snacks
  if (cat.includes('beverage')) return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'; // beverages
  if (cat.includes('rice') || cat.includes('grain')) return 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=500&q=80'; // grains
  if (cat.includes('household')) return 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=500&q=80'; // cleaning
  if (cat.includes('personal')) return 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80'; // personal care
  
  // Generic fallback for any unrecognized categories
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
};
