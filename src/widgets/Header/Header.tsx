import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, LogIn, ShoppingBag, LogOut, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../shared/store/store';
import { logout } from '../../shared/store/authSlice';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(localStorage.getItem('lang') || 'en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Search state
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const cartItemCount = useSelector((state: RootState) =>
    state.cart.cartItems.reduce((sum, item) => sum + (item.cartQuantity || 0), 0)
  );
  const navigate = useNavigate();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'tj', label: 'Тоҷикӣ', flag: '🇹🇯' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Fetch products and categories for search autocomplete
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/Category/get-categories`)
        ]);
        if (prodRes.data?.data?.products) {
          setProducts(prodRes.data.data.products);
        }
        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };
    fetchSearchData();
  }, []);

  const handleLangChange = (code: string) => {
    setActiveLang(code);
    localStorage.setItem('lang', code);
    setIsLangDropdownOpen(false);
    i18n.changeLanguage(code);
    window.dispatchEvent(new Event('languageChange'));
  };

  const handleProtectedAction = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);
  const filteredCategories = categories.filter(c => c.categoryName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
  const hasSearchResults = filteredProducts.length > 0 || filteredCategories.length > 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#18181B] border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-[#DB4444] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
          
          <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/Logo.png" alt="Fast-Cart Logo" className="dark:invert transition-all" />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 whitespace-nowrap">
          <NavLink to="/" className={({ isActive }) => `text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-[#DB4444] dark:text-[#DB4444] underline underline-offset-8 decoration-2' : 'text-gray-800 dark:text-gray-200 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}>{t('Home')}</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-[#DB4444] dark:text-[#DB4444] underline underline-offset-8 decoration-2' : 'text-gray-800 dark:text-gray-200 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}>{t('Contact')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => `text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-[#DB4444] dark:text-[#DB4444] underline underline-offset-8 decoration-2' : 'text-gray-800 dark:text-gray-200 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}>{t('About')}</NavLink>
          <NavLink to="/signup" className={({ isActive }) => `text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-[#DB4444] dark:text-[#DB4444] underline underline-offset-8 decoration-2' : 'text-gray-800 dark:text-gray-200 hover:text-[#DB4444] dark:hover:text-[#DB4444]'}`}>{t('Sign Up')}</NavLink>
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <div ref={searchRef} className="hidden lg:flex relative items-center bg-[#F5F5F5] dark:bg-zinc-800/50 rounded-full px-4 py-2.5 w-64 text-sm transition-colors border border-transparent dark:border-zinc-700/50 focus-within:border-[#DB4444]/30">
            <input 
              type="text" 
              placeholder={t('What are you looking for?')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent outline-none w-full text-gray-800 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
            />
            <Search size={18} className="text-gray-500 dark:text-zinc-400 cursor-pointer hover:text-[#DB4444] transition-colors" />
            
            {/* Search Dropdown Desktop */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {hasSearchResults ? (
                  <ul className="py-2">
                    {filteredCategories.map(category => (
                      <li key={`cat-${category.id}`}>
                        <button 
                          onMouseDown={() => {
                            navigate(`/products?category=${category.id}`);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Search size={16} className="text-[#DB4444] shrink-0" />
                            <span className="text-sm font-medium text-gray-800 dark:text-zinc-200 line-clamp-1">{category.categoryName}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{t('Category', 'Category')}</span>
                        </button>
                      </li>
                    ))}
                    {filteredProducts.map(product => (
                      <li key={`prod-${product.id}`}>
                        <button 
                          onMouseDown={() => {
                            navigate(`/product/${product.id}`);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                          <Search size={16} className="text-gray-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-800 dark:text-zinc-200 line-clamp-1">{product.productName}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500 dark:text-zinc-400 text-center">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden lg:flex p-2 rounded-full text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="hidden lg:block relative" ref={langDropdownRef}>
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <Globe size={18} />
                <span className="hidden sm:inline-block uppercase tracking-wide text-xs">{activeLang}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-3 w-36 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${activeLang === lang.code ? 'bg-[#DB4444]/10 text-[#DB4444] dark:text-[#DB4444] font-semibold' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                        onClick={() => handleLangChange(lang.code)}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <Link to="/wishlist" onClick={(e) => handleProtectedAction(e, '/wishlist')} className="hidden lg:flex p-2 rounded-full text-gray-800 dark:text-zinc-200 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
              <Heart size={22} />
            </Link>
            
            <Link to="/cart" onClick={(e) => handleProtectedAction(e, '/cart')} className="hidden lg:flex relative p-2 rounded-full text-gray-800 dark:text-zinc-200 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
              <ShoppingCart size={22} />
              {isAuthenticated && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#DB4444] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#18181B]">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center justify-center p-2 rounded-full transition-all ${isUserDropdownOpen ? 'bg-[#DB4444] text-white shadow-md shadow-red-500/20' : 'text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                >
                  <User size={22} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      <Link to="/account" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <User size={18} className="text-gray-400 dark:text-zinc-400" /> <span className="text-sm font-medium">{t('My Account')}</span>
                      </Link>
                      <Link to="/orders" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <ShoppingBag size={18} className="text-gray-400 dark:text-zinc-400" /> <span className="text-sm font-medium">{t('My Orders')}</span>
                      </Link>
                      <Link to="/wishlist" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <Heart size={18} className="text-gray-400 dark:text-zinc-400" /> <span className="text-sm font-medium">{t('Wishlist')}</span>
                      </Link>
                      <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left">
                        <LogOut size={18} /> <span className="text-sm font-medium">{t('Logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full text-gray-800 dark:text-zinc-200 hover:text-[#DB4444] dark:hover:text-[#DB4444] transition-colors">
                <LogIn size={22} />
              </Link>
            )}

          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-[73px] bottom-0 z-40 bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-zinc-800/50 overflow-y-auto animate-in slide-in-from-top-4 fade-in duration-300">
          <nav className="flex flex-col px-6 py-8 space-y-8 min-h-full">
            <div ref={mobileSearchRef} className="flex relative flex-col w-full z-50">
              <div className="flex relative items-center bg-gray-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl px-5 py-3.5 w-full text-base border border-transparent dark:border-zinc-700/50 focus-within:border-[#DB4444]/50 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all shadow-inner">
                <input 
                  type="text" 
                  placeholder={t('What are you looking for?')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsMobileSearchFocused(true)}
                  className="bg-transparent outline-none w-full text-gray-900 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400 font-medium"
                />
                <Search size={20} className="text-gray-400 dark:text-zinc-500" />
              </div>

              {/* Search Dropdown Mobile */}
              {isMobileSearchFocused && searchQuery && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {hasSearchResults ? (
                    <ul className="py-2">
                      {filteredCategories.map(category => (
                        <li key={`cat-${category.id}`}>
                          <button 
                            onMouseDown={() => {
                              navigate(`/products?category=${category.id}`);
                              setSearchQuery('');
                              setIsMobileSearchFocused(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-gray-50 dark:border-zinc-800/50 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                                <Search size={14} className="text-[#DB4444]" />
                              </div>
                              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 line-clamp-1">{category.categoryName}</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md font-medium">{t('Category', 'Category')}</span>
                          </button>
                        </li>
                      ))}
                      {filteredProducts.map(product => (
                        <li key={`prod-${product.id}`}>
                          <button 
                            onMouseDown={() => {
                              navigate(`/product/${product.id}`);
                              setSearchQuery('');
                              setIsMobileSearchFocused(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-gray-50 dark:border-zinc-800/50 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                              <Search size={14} className="text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 line-clamp-1">{product.productName}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-8 text-sm text-gray-500 dark:text-zinc-400 text-center flex flex-col items-center gap-2">
                      <Search size={24} className="text-gray-300 dark:text-zinc-600 mb-1" />
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 px-1">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `text-xl font-semibold p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-red-50 dark:bg-red-500/10 text-[#DB4444] dark:text-[#DB4444]' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>{t('Home')}</NavLink>
              <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `text-xl font-semibold p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-red-50 dark:bg-red-500/10 text-[#DB4444] dark:text-[#DB4444]' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>{t('Contact')}</NavLink>
              <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `text-xl font-semibold p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-red-50 dark:bg-red-500/10 text-[#DB4444] dark:text-[#DB4444]' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>{t('About')}</NavLink>
              <NavLink to="/signup" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `text-xl font-semibold p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-red-50 dark:bg-red-500/10 text-[#DB4444] dark:text-[#DB4444]' : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>{t('Sign Up')}</NavLink>
            </div>
            
            <div className="grid grid-cols-2 gap-3 px-1">
              <Link to="/wishlist" onClick={(e) => { handleProtectedAction(e, '/wishlist'); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 text-gray-800 dark:text-gray-200 hover:text-[#DB4444] transition-colors">
                <Heart size={22} />
                <span className="font-semibold">{t('Wishlist')}</span>
              </Link>
              
              <Link to="/cart" onClick={(e) => { handleProtectedAction(e, '/cart'); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 text-gray-800 dark:text-gray-200 hover:text-[#DB4444] transition-colors relative">
                <ShoppingCart size={22} />
                <span className="font-semibold">{t('Cart')}</span>
                {isAuthenticated && cartItemCount > 0 && (
                  <span className="absolute top-2 right-2 bg-[#DB4444] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 px-1">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 text-gray-800 dark:text-gray-200 transition-colors">
                {isDarkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} />}
                <span className="font-semibold">{t('Theme')}</span>
              </button>
              
              <div className="relative flex items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 text-gray-800 dark:text-gray-200">
                <select 
                  value={activeLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 pointer-events-none">
                  <Globe size={22} />
                  <span className="font-semibold uppercase">{activeLang}</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-8 pb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-700 to-transparent mb-6"></div>
              <div className="px-1">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-lg font-semibold flex items-center justify-center gap-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  <LogOut size={22} /> {t('Logout')}
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full p-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10">
                  <LogIn size={22} /> {t('Log In')}
                </Link>
              )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
