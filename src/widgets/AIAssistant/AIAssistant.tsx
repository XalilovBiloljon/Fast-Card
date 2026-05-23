import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';
import { addToCart, clearCart } from '../../shared/store/cartSlice';
import { addToWishlist } from '../../shared/store/wishlistSlice';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

interface IMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const getSystemPrompt = (isAuthenticated: boolean) => {
  const currentLang = localStorage.getItem('lang') || 'en';
  return `You are a helpful AI assistant for the Fast-Cart E-commerce website. 
Your purpose is to help customers with their queries related to Fast-Cart, find products, manage their cart/wishlist, and navigate the website. 
You can use tools to perform actions like adding items to the cart, searching for products, applying filters, and opening the developer modal. 

CRITICAL RULE REGARDING AUTHENTICATION:
The user is currently ${isAuthenticated ? "LOGGED IN" : "NOT LOGGED IN"}. 
If the user is NOT LOGGED IN, they CANNOT perform ANY actions like adding to cart, clearing cart, adding to wishlist, or applying filters. 
If the user is NOT LOGGED IN and asks to do any of these actions, DO NOT use any tools. Instead, politely tell them (in the current language) that they must log in or sign up first to use these features, and offer to navigate them to the login page (using navigate_to_page with path "/login").

CRITICAL RULE REGARDING LANGUAGE: 
The user's current site language is set to: "${currentLang}". 
You MUST reply in this language by default.
HOWEVER, if the user explicitly writes in Tajik (even using latin alphabet like "salom", "chikheli"), you MUST reply in standard Tajik using the Cyrillic alphabet (Тоҷикӣ). 
Example: user says "salom", you say "Салом! Чӣ гуна метавонам ба шумо кӯмак кунам?". 

CRITICAL RULE REGARDING CREATOR / DEVELOPER:
If the user asks who created, built, programmed this website/bot, or asks for full info about the creator, you MUST say exactly: "Ин вебсайтро Халилов Билолҷон, ки як Frontend барномасози моҳир аст, сохтааст." AND you MUST execute the "open_developer_modal" tool to show them the full modal.`;
};

export const AIAssistant = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: '1',
      role: 'model',
      content: 'Салом! Ман ассистенти зеҳни сунъии Fast-Cart ҳастам. Чӣ гуна метавонам ба шумо кӯмак расонам?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: input
      }, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Ошибка: VITE_GEMINI_API_KEY не настроен в файле .env'
      }]);
      setInput('');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    }]);

    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-flash-lite-latest',
        systemInstruction: getSystemPrompt(isAuthenticated),
        tools: [
          {
            functionDeclarations: [
              {
                name: 'search_products',
                description: 'Search for products in the Fast-Cart database by keyword (e.g. phone, laptop, watch, camera). Returns product ID, name, price, and discountPrice. Always use this first before adding to cart to find the correct product ID.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    keyword: {
                      type: SchemaType.STRING,
                      description: 'The search keyword to filter products. Leave empty to get all products.'
                    }
                  }
                }
              },
              {
                name: 'add_to_cart',
                description: 'Add a specific product to the user\'s shopping cart using its exact ID.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    productId: {
                      type: SchemaType.NUMBER,
                      description: 'The exact ID of the product to add to the cart.'
                    }
                  },
                  required: ['productId']
                }
              },
              {
                name: 'add_to_wishlist',
                description: 'Add a specific product to the user\'s wishlist using its exact ID.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    productId: {
                      type: SchemaType.NUMBER,
                      description: 'The exact ID of the product to add to the wishlist.'
                    }
                  },
                  required: ['productId']
                }
              },
              {
                name: 'open_developer_modal',
                description: 'Open the developer profile modal when the user asks for full information about the creator/developer.',
                parameters: { type: SchemaType.OBJECT, properties: {} }
              },
              {
                name: 'clear_cart',
                description: 'Remove all items and clear the user\'s shopping cart.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {}
                }
              },
              {
                name: 'navigate_to_page',
                description: 'Navigate the user\'s screen to a specific page on the website.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    path: {
                      type: SchemaType.STRING,
                      description: 'The route path to navigate to (e.g., "/", "/cart", "/checkout", "/products").'
                    }
                  },
                  required: ['path']
                }
              },
              {
                name: 'apply_product_filters',
                description: 'Apply product filters on the products page (e.g., set category, minPrice, maxPrice). Navigates to the products page with applied filters.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    categoryId: { type: SchemaType.NUMBER, description: 'Category ID to filter by.' },
                    minPrice: { type: SchemaType.NUMBER, description: 'Minimum price.' },
                    maxPrice: { type: SchemaType.NUMBER, description: 'Maximum price.' },
                  }
                }
              },
              {
                name: 'fill_contact_form',
                description: 'Navigate to the Contact page and pre-fill the contact form inputs with user information.',
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING, description: 'User name' },
                    email: { type: SchemaType.STRING, description: 'User email' },
                    phone: { type: SchemaType.STRING, description: 'User phone number' },
                    message: { type: SchemaType.STRING, description: 'Message content' },
                  }
                }
              }
            ]
          }
        ]
      });
      
      const chatHistory = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({ history: chatHistory });
      let result = await chat.sendMessage([{ text: userMessage }]);
      let functionCalls = result.response.functionCalls();

      while (functionCalls && functionCalls.length > 0) {
        const functionResponses = [];
        
        for (const call of functionCalls) {
          if (call.name === 'search_products') {
            const args = call.args as { keyword?: string };
            const keyword = args.keyword || '';
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
              let prods = res.data?.data?.products || [];
              if (keyword) {
                prods = prods.filter((p: Record<string, unknown>) => 
                  String(p.productName || '').toLowerCase().includes(keyword.toLowerCase()) || 
                  (p.categoryName && String(p.categoryName || '').toLowerCase().includes(keyword.toLowerCase()))
                );
              }
              const simplifiedProds = prods.map((p: Record<string, unknown>) => ({
                id: p.id,
                name: p.productName,
                price: p.price,
                discountPrice: p.hasDiscount ? p.discountPrice : null
              }));
              
              functionResponses.push({
                functionResponse: {
                  name: call.name,
                  response: { products: simplifiedProds.slice(0, 15) } 
                }
              });
            } catch {
              functionResponses.push({
                functionResponse: { name: call.name, response: { error: "Failed to fetch products" } }
              });
            }
          } 
          else if (call.name === 'add_to_cart') {
            if (!isAuthenticated) {
              functionResponses.push({
                functionResponse: { name: call.name, response: { error: "User is not logged in. Tell them they must log in first." } }
              });
              continue;
            }
            const args = call.args as { productId: number };
            const productId = args.productId;
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
              const prods = res.data?.data?.products || [];
              const p = prods.find((x: Record<string, unknown>) => x.id === productId);
              if (p) {
                dispatch(addToCart(p as any));
                functionResponses.push({
                  functionResponse: { name: call.name, response: { success: true, message: "Product successfully added to cart" } }
                });
              } else {
                functionResponses.push({
                  functionResponse: { name: call.name, response: { error: "Product ID not found" } }
                });
              }
            } catch {
               functionResponses.push({
                 functionResponse: { name: call.name, response: { error: "Failed to fetch products for adding to cart" } }
               });
            }
          }
          else if (call.name === 'add_to_wishlist') {
            if (!isAuthenticated) {
              functionResponses.push({
                functionResponse: { name: call.name, response: { error: "User is not logged in. Tell them they must log in first." } }
              });
              continue;
            }
            const args = call.args as { productId: number };
            const productId = args.productId;
            try {
              const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Product/get-products`);
              const prods = res.data?.data?.products || [];
              const p = prods.find((x: Record<string, unknown>) => x.id === productId);
              if (p) {
                dispatch(addToWishlist(p as any));
                functionResponses.push({
                  functionResponse: { name: call.name, response: { success: true, message: "Product successfully added to wishlist" } }
                });
              } else {
                functionResponses.push({
                  functionResponse: { name: call.name, response: { error: "Product ID not found" } }
                });
              }
            } catch {
               functionResponses.push({
                 functionResponse: { name: call.name, response: { error: "Failed to fetch products for adding to wishlist" } }
               });
            }
          }
          else if (call.name === 'open_developer_modal') {
            window.dispatchEvent(new Event('openDeveloperModal'));
            functionResponses.push({
              functionResponse: { name: call.name, response: { success: true, message: "Developer modal opened" } }
            });
          }
          else if (call.name === 'clear_cart') {
            if (!isAuthenticated) {
              functionResponses.push({
                functionResponse: { name: call.name, response: { error: "User is not logged in." } }
              });
              continue;
            }
            dispatch(clearCart());
            functionResponses.push({
              functionResponse: { name: call.name, response: { success: true, message: "Cart cleared" } }
            });
          }
          else if (call.name === 'navigate_to_page') {
            const path = (call.args as { path: string }).path;
            navigate(path);
            functionResponses.push({
              functionResponse: { name: call.name, response: { success: true, message: `Navigated to ${path}` } }
            });
          }
          else if (call.name === 'apply_product_filters') {
            const args = call.args as { categoryId?: number, minPrice?: number, maxPrice?: number };
            const params = new URLSearchParams();
            if (args.categoryId !== undefined) params.append('category', args.categoryId.toString());
            if (args.minPrice !== undefined) params.append('minPrice', args.minPrice.toString());
            if (args.maxPrice !== undefined) params.append('maxPrice', args.maxPrice.toString());
            
            navigate(`/products?${params.toString()}`);
            functionResponses.push({
              functionResponse: { name: call.name, response: { success: true, message: "Filters applied and navigated to products page" } }
            });
          }
          else if (call.name === 'fill_contact_form') {
            const args = call.args as { name?: string, email?: string, phone?: string, message?: string };
            const params = new URLSearchParams();
            if (args.name) params.append('name', args.name);
            if (args.email) params.append('email', args.email);
            if (args.phone) params.append('phone', args.phone);
            if (args.message) params.append('message', args.message);
            
            navigate(`/contact?${params.toString()}`);
            functionResponses.push({
              functionResponse: { name: call.name, response: { success: true, message: "Navigated to contact page and filled the form" } }
            });
          }
        }
        
        result = await chat.sendMessage(functionResponses);
        functionCalls = result.response.functionCalls();
      }

      const responseText = result.response.text();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: responseText
      }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: `Хатогӣ ҳангоми пайвастшавӣ ба Gemini: ${errorMsg}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-8 z-50 font-poppins">
      
      {isOpen && (
        <div className="absolute bottom-32 right-0 w-[380px] sm:w-[420px] h-[600px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(219,68,68,0.4)] border border-gray-100 overflow-hidden transition-all duration-500 transform origin-bottom-right flex flex-col z-50 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="bg-[#DB4444] p-6 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/20 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <Bot size={26} className="text-[#DB4444]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full z-20 shadow-sm"></span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-white tracking-wide drop-shadow-md">Fast-Cart AI</h3>
                <p className="text-sm text-white/90 font-medium mt-0.5">Онлайн ва омода ба кӯмак!</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="relative z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all backdrop-blur-sm active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 fastcart-ai-bg">
            {messages.length === 1 && (
              <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-red-50 text-center mb-2">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Sparkles className="text-[#DB4444]" size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">Хуш омадед ба Fast-Cart!</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                  Ман ассистенти зеҳни сунъӣ ҳастам. Метавонам ба саволҳои шумо ҷавоб диҳам, маҳсулот пайдо кунам ё онро ба сабад илова кунам.
                </p>
              </div>
            )}

            {messages.slice(1).map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-5 py-4 text-[14px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#DB4444] text-white rounded-[24px] rounded-br-[6px] shadow-[0_5px_15px_rgba(219,68,68,0.25)]' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-[24px] rounded-bl-[6px] shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-[24px] rounded-bl-[6px] px-6 py-4 flex items-center gap-3 text-gray-500 shadow-[0_8px_25px_rgba(0,0,0,0.06)]">
                  <Loader2 size={18} className="animate-spin text-[#DB4444]" />
                  <span className="text-[13px] font-semibold tracking-wide">Дар ҳоли иҷро...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10 shrink-0">
            <div className="relative flex items-center bg-[#f7f7f7] border border-gray-200/80 rounded-2xl focus-within:border-[#DB4444]/60 focus-within:ring-4 focus-within:ring-[#DB4444]/15 transition-all duration-300 shadow-inner">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Саволи худро нависед..."
                className="w-full bg-transparent pl-5 pr-14 py-4 text-[14px] outline-none resize-none h-[54px] max-h-[120px] text-gray-700 font-medium placeholder:text-gray-400"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-10 h-10 rounded-xl bg-[#DB4444] hover:bg-[#c23b3b] disabled:bg-gray-300 text-white flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Крутящийся текст и кнопка */}
      <div className="relative flex items-center justify-center w-[120px] h-[120px]">
        {/* SVG с крутящимся текстом */}
        {!isOpen && (
          <svg 
            className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" 
            viewBox="0 0 100 100"
          >
            <path 
              id="textPath" 
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" 
              fill="none" 
            />
            <text className="text-[11px] font-bold uppercase tracking-[0.2em] fill-[#DB4444]">
              <textPath href="#textPath" startOffset="0%">
                AI ASSISTANT • FAST CART • AI ASSISTANT • FAST CART • 
              </textPath>
            </text>
          </svg>
        )}
        
        {/* Сама кнопка в центре */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 rounded-full flex items-center justify-center bg-[#DB4444] text-white shadow-[0_8px_30px_rgba(219,68,68,0.5)] hover:shadow-[0_8px_40px_rgba(219,68,68,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 ${
            isOpen ? 'w-16 h-16' : 'w-14 h-14'
          }`}
        >
          {isOpen ? <X size={28} /> : <Sparkles size={26} className="animate-pulse" />}
        </button>
      </div>
    </div>
  );
};
