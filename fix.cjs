const fs = require('fs');

const fixFile = (filePath, fixes) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const fix of fixes) {
    content = content.replace(fix.search, fix.replace);
  }
  // Remove UI comments (JSX)
  content = content.replace(/[ \t]*\{\/\*[\s\S]*?\*\/\}\r?\n?/g, '');
  fs.writeFileSync(filePath, content);
};

// 1. CheckoutPage.tsx
fixFile('src/pages/checkout/CheckoutPage.tsx', [
  { search: "import { useState, useEffect, useRef } from 'react';", replace: "import { useState, useEffect, useRef, useMemo } from 'react';" },
  { search: "const safeCartItems = cartItems ?? [];", replace: "const safeCartItems = useMemo(() => cartItems ?? [], [cartItems]);" }
]);

// 2. CartPage.tsx
fixFile('src/pages/cart/CartPage.tsx', [
  { search: "import { useState } from 'react';", replace: "import { useState, useMemo } from 'react';" },
  { search: "const safeCartItems = cartItems ?? [];", replace: "const safeCartItems = useMemo(() => cartItems ?? [], [cartItems]);" }
]);

// 3. LoginPage.tsx
fixFile('src/pages/LoginPage.tsx', [
  { search: "} catch (error: any) {", replace: "} catch (error) {\n        const err = error as any;" },
  { search: /error\.response/g, replace: "err.response" }
]);

// 4. SignUpPage.tsx
fixFile('src/pages/SignUpPage.tsx', [
  { search: "} catch (error: any) {", replace: "} catch (error) {\n        const err = error as any;" },
  { search: /error\.response/g, replace: "err.response" }
]);

// 5. NotFoundPage.tsx
fixFile('src/pages/NotFoundPage.tsx', [
  { search: "export const NotFoundPage = (_props: Partial<FallbackProps>) => {", replace: "export const NotFoundPage = () => {" },
  { search: "import type { FallbackProps } from 'react-error-boundary';\r\n", replace: "" },
  { search: "import type { FallbackProps } from 'react-error-boundary';\n", replace: "" }
]);

// 6. FlashSalesSection.tsx
fixFile('src/pages/home/sections/FlashSalesSection.tsx', [
  { search: /@ts-ignore/g, replace: "@ts-expect-error" }
]);

// 7. BestSellingSection.tsx
fixFile('src/pages/home/sections/BestSellingSection.tsx', []);

console.log("Fixes applied successfully.");
