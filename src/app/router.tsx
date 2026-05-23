import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "../pages/home/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProductDetailsPage } from "../pages/product/ProductDetailsPage";
import { CartPage } from "../pages/cart/CartPage";
import { WishlistPage } from "../pages/wishlist/WishlistPage";
import { CheckoutPage } from "../pages/checkout/CheckoutPage";
import { ProductsPage } from "../pages/products/ProductsPage";
import { ContactPage } from "../pages/contact/ContactPage";
import { AboutPage } from "../pages/about/AboutPage";
import AccountPage from "../pages/account/AccountPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "wishlist",
        element: <WishlistPage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ],
  },
]);
