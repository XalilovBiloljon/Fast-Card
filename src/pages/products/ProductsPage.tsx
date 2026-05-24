import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { ProductCard } from '../../shared/components/ProductCard';

interface IProduct {
  id: number;
  productName: string;
  image: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  quantity: number;
  categoryId?: number;
  brandId?: number;
  rating?: number;
}

interface ICategory {
  id: number;
  categoryName: string;
}

interface IBrand {
  id: number;
  brandName: string;
}

export const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  // Состояния для фильтров (категории, бренды, рейтинг, цена)
  const initialCategoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Фиксированные пределы цен (1 - 9999)
  const MIN_PRICE = 1;
  const MAX_PRICE = 9999;

  // Синхронизация состояния с параметрами URL при загрузке и изменении URL
  useEffect(() => {
    const category = searchParams.get('category') ? Number(searchParams.get('category')) : null;
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');
    
    setSelectedCategory(category);
    if (urlMinPrice) {
      setMinPrice(urlMinPrice);
      setAppliedMinPrice(Number(urlMinPrice));
    } else {
      setMinPrice('');
      setAppliedMinPrice(null);
    }
    
    if (urlMaxPrice) {
      setMaxPrice(urlMaxPrice);
      setAppliedMaxPrice(Number(urlMaxPrice));
    } else {
      setMaxPrice('');
      setAppliedMaxPrice(null);
    }
  }, [searchParams]);

  // Accordion states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  // "See all" states
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/Category/get-categories`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/Brand/get-brands`)
        ]);

        if (productsRes.data?.data?.products) {
          setProducts(productsRes.data.data.products);
        }
        if (categoriesRes.data?.data) {
          setCategories(categoriesRes.data.data);
        }
        if (brandsRes.data?.data?.brands) {
          // Remove duplicate brands if any based on name
          const uniqueBrands = Array.from(new Map(brandsRes.data.data.brands.map((item: IBrand) => [item.brandName, item])).values()) as IBrand[];
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Обработчик выбора категории и обновление URL
  const handleCategoryClick = (id: number | null) => {
    setSelectedCategory(id);
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('category', id.toString());
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  // Переключение выбранных брендов
  const handleBrandToggle = (id: number) => {
    setSelectedBrands(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  // Применение фильтра по цене и обновление URL
  const handleApplyPrice = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (minPrice) {
      newParams.set('minPrice', minPrice);
    } else {
      newParams.delete('minPrice');
    }
    
    if (maxPrice) {
      newParams.set('maxPrice', maxPrice);
    } else {
      newParams.delete('maxPrice');
    }
    
    setSearchParams(newParams);
    
    setAppliedMinPrice(minPrice ? Number(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
  };

  // Основная логика фильтрации и сортировки товаров

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Brands Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brandId && selectedBrands.includes(p.brandId));
    }

    // Rating Filter
    if (selectedRatings.length > 0) {
      result = result.filter(p => p.rating && selectedRatings.includes(Math.floor(p.rating)));
    }

    // Price Filter
    if (appliedMinPrice !== null) {
      result = result.filter(p => (p.hasDiscount ? p.discountPrice : p.price) >= appliedMinPrice);
    }
    if (appliedMaxPrice !== null) {
      result = result.filter(p => (p.hasDiscount ? p.discountPrice : p.price) <= appliedMaxPrice);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.hasDiscount ? a.discountPrice : a.price) - (b.hasDiscount ? b.discountPrice : b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.hasDiscount ? b.discountPrice : b.price) - (a.hasDiscount ? a.discountPrice : a.price));
        break;
      // popularity is default, no specific sort property available from API, relying on initial order
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedBrands, selectedRatings, appliedMinPrice, appliedMaxPrice, sortBy]);

  const RatingStars = ({ count }: { count: number }) => {
    return (
      <div className="flex gap-1 text-[#FFAD33]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < count ? "currentColor" : "none"} strokeWidth={i < count ? 0 : 1} stroke="currentColor" className={i >= count ? "text-gray-300 dark:text-zinc-600" : ""} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 lg:px-8 py-10 min-h-[60vh] font-poppins transition-colors duration-300">
      
      {/* Breadcrumbs & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('Home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white">{t('Explore Our Products')}</span>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent border border-gray-300 dark:border-zinc-700 rounded px-4 py-2 pr-10 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-[#DB4444] text-gray-700 dark:text-zinc-200 cursor-pointer"
            >
              <option value="popularity" className="dark:bg-zinc-800">{t('Popularity')}</option>
              <option value="price-asc" className="dark:bg-zinc-800">{t('Price: Low to High')}</option>
              <option value="price-desc" className="dark:bg-zinc-800">{t('Price: High to Low')}</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          
          {/* Category Filter */}
          <div className="border-b border-gray-200 dark:border-zinc-800 pb-6 mb-6">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)} 
              className="flex items-center justify-between w-full font-semibold text-gray-800 dark:text-zinc-100 mb-4"
            >
              {t('Category')}
              {isCategoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isCategoryOpen && (
              <ul className="space-y-3 pl-1">
                <li>
                  <button 
                    onClick={() => handleCategoryClick(null)}
                    className={`text-sm text-left w-full transition-colors ${selectedCategory === null ? 'text-[#DB4444] font-medium' : 'text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}
                  >
                    {t('All products')}
                  </button>
                </li>
                {(showAllCategories ? categories : categories.slice(0, 5)).map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`text-sm text-left w-full transition-colors ${selectedCategory === cat.id ? 'text-[#DB4444] font-medium' : 'text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}
                    >
                      {cat.categoryName}
                    </button>
                  </li>
                ))}
                {categories.length > 5 && !showAllCategories && (
                  <li>
                    <button 
                      onClick={() => setShowAllCategories(true)}
                      className="text-sm text-[#DB4444] hover:underline mt-2"
                    >
                      {t('See all')} ({categories.length - 5})
                    </button>
                  </li>
                )}
                {categories.length > 5 && showAllCategories && (
                  <li>
                    <button 
                      onClick={() => setShowAllCategories(false)}
                      className="text-sm text-[#DB4444] hover:underline mt-2"
                    >
                      {t('See less')}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Brands Filter */}
          <div className="border-b border-gray-200 dark:border-zinc-800 pb-6 mb-6">
            <button 
              onClick={() => setIsBrandsOpen(!isBrandsOpen)} 
              className="flex items-center justify-between w-full font-semibold text-gray-800 dark:text-zinc-100 mb-4"
            >
              {t('Brands')}
              {isBrandsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isBrandsOpen && (
              <ul className="space-y-3 pl-1">
                {(showAllBrands ? brands : brands.slice(0, 5)).map(brand => (
                  <li key={brand.id} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] dark:border-zinc-600 dark:bg-zinc-800 accent-[#DB4444] cursor-pointer"
                    />
                    <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-600 dark:text-zinc-400 cursor-pointer hover:text-black dark:hover:text-zinc-200">
                      {brand.brandName}
                    </label>
                  </li>
                ))}
                {brands.length > 5 && !showAllBrands && (
                  <li>
                    <button 
                      onClick={() => setShowAllBrands(true)}
                      className="text-sm text-[#DB4444] hover:underline mt-2"
                    >
                      {t('See all')} ({brands.length - 5})
                    </button>
                  </li>
                )}
                {brands.length > 5 && showAllBrands && (
                  <li>
                    <button 
                      onClick={() => setShowAllBrands(false)}
                      className="text-sm text-[#DB4444] hover:underline mt-2"
                    >
                      {t('See less')}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Price Range */}
          <div className="border-b border-gray-200 dark:border-zinc-800 pb-6 mb-6">
            <button 
              onClick={() => setIsPriceOpen(!isPriceOpen)} 
              className="flex items-center justify-between w-full font-semibold text-gray-800 dark:text-zinc-100 mb-4"
            >
              {t('Price range')}
              {isPriceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isPriceOpen && (
              <div className="pl-1">
                <div className="relative w-full h-8 mb-4 mt-2">
                  {/* Фоновая линия слайдера */}
                  <div className="absolute w-full h-1 bg-gray-200 dark:bg-zinc-700 rounded top-3.5"></div>
                  {/* Активная (красная) линия между ползунками */}
                  <div 
                    className="absolute h-1 bg-[#DB4444] rounded top-3.5" 
                    style={{ 
                      left: `${((Number(minPrice || MIN_PRICE) - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`, 
                      right: `${100 - (((Number(maxPrice) || MAX_PRICE) - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%` 
                    }}
                  ></div>
                  
                  {/* Ползунок минимальной цены */}
                  <input 
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="1"
                    value={minPrice || MIN_PRICE}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), Number(maxPrice || MAX_PRICE) - 1);
                      setMinPrice(val.toString());
                    }}
                    className="absolute w-full top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#DB4444] [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#DB4444] [&::-moz-range-thumb]:rounded-full z-10"
                  />
                  {/* Ползунок максимальной цены */}
                  <input 
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="1"
                    value={maxPrice || MAX_PRICE}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), Number(minPrice || MIN_PRICE) + 1);
                      setMaxPrice(val.toString());
                    }}
                    className="absolute w-full top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#DB4444] [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#DB4444] [&::-moz-range-thumb]:rounded-full z-20"
                  />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Min</label>
                    <input 
                      type="number" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="1"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-transparent text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#DB4444] dark:text-zinc-200"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Max</label>
                    <input 
                      type="number" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="9999"
                      className="w-full border border-gray-300 dark:border-zinc-700 bg-transparent text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#DB4444] dark:text-zinc-200"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleApplyPrice}
                  className="w-full border border-[#DB4444] text-[#DB4444] hover:bg-[#DB4444] hover:text-white transition-colors py-2 rounded text-sm font-medium"
                >
                  {t('Apply')}
                </button>
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="pb-6">
            <button 
              onClick={() => setIsRatingOpen(!isRatingOpen)} 
              className="flex items-center justify-between w-full font-semibold text-gray-800 dark:text-zinc-100 mb-4"
            >
              {t('Ratings')}
              {isRatingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isRatingOpen && (
              <ul className="space-y-3 pl-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <li key={rating} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingToggle(rating)}
                      className="w-4 h-4 rounded border-gray-300 text-[#DB4444] focus:ring-[#DB4444] dark:border-zinc-600 dark:bg-zinc-800 accent-[#DB4444] cursor-pointer mt-0.5"
                    />
                    <label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      <RatingStars count={rating} />
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500 dark:text-zinc-400">{t("Loading products...")}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-500 dark:text-zinc-400">{t("No products found")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length > 0 && (
             <div className="flex justify-center mt-14">
               <button className="bg-[#DB4444] hover:bg-[#c23b3b] text-white px-10 py-3.5 rounded font-medium transition-colors">
                 {t('More Products')}
               </button>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};
