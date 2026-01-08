# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

danh sach api
POST
/api/users/register

POST
/api/users/login

GET
/api/users/check

GET
/api/users/profile

PUT
/api/users/profile

POST
/api/users/avatar

GET
/api/users/address

POST
/api/users/address

PUT
/api/users/address/{id}

DELETE
/api/users/address/{id}

PUT
/api/users/address/{id}/default

POST
/api/admin/create

GET
/api/admin/flash-sales/pending

PUT
/api/admin/flash-sales/approve/{id}

PUT
/api/admin/flash-sales/reject/{id}

POST
/api/admin/

DELETE
/api/admin/{id}

GET
/api/admin/products/stats

GET
/api/admin/products/

POST
/api/admin/products/

PUT
/api/admin/products/{id}

DELETE
/api/admin/products/{id}

GET
/api/seller/products

POST
/api/seller/products

PUT
/api/seller/products/{id}

DELETE
/api/seller/products/{id}

GET
/api/seller/products/{id}

GET
/api/seller/settings

PUT
/api/seller/settings

POST
/api/seller/settings/upload

GET
/api/seller/flash-sales

POST
/api/seller/flash-sales

GET
/api/seller/dashboard/stats

GET
/api/seller/dashboard/recent-orders

GET
/api/seller/dashboard/top-products

GET
/api/seller/dashboard/summary

GET
/api/categories/

GET
/api/categories/slug/{slug}

GET
/api/categories/{id}

GET
/api/categories/menu

GET
/api/brands/

GET
/api/brands/{id}

GET
/api/products/

GET
/api/products/featured

GET
/api/products/hot

GET
/api/products/{id}

GET
/api/banners/

GET
/api/banners/active

GET
/api/flash-sales/active

POST
/api/order/

GET
/api/order/

GET
/api/cart/

POST
/api/cart/add

PUT
/api/cart/update

DELETE
/api/cart/remove/{itemId}
