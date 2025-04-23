import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Main from './layout/Main.jsx'
import Home from './pages/home/Home.jsx'
import About from './pages/about/About.jsx'
import Contact from './pages/contact/Contact.jsx'
import Privacy from './pages/policy/Privacy.jsx'
import Terms from './pages/policy/Terms.jsx'
import License from './pages/policy/License.jsx'
import Faq from './pages/others/Faq.jsx'
import Blog from './pages/others/Blog.jsx'
import Login from './pages/user/Login.jsx'
import Categories from './pages/categories/Categories.jsx'
import Register from './pages/user/Register.jsx'
import ForgetPassword from './pages/user/ForgetPassword.jsx'
import AuthProvider from './providers/AuthProvider.jsx'
import Profile from './pages/user/profile/Profile.jsx'
import Settings from './pages/user/profile/Settings.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import UploadImage from './pages/user/profile/UploadImage.jsx'
import PageNotFound from './pages/errorpage/PageNotFound.jsx'
import RedirectIfAuth from './routes/RedirectIfAuth.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <PageNotFound></PageNotFound>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/about",
        element: <About></About>
      },
      {
        path: "/contact",
        element: <Contact></Contact>
      },
      {
        path: "/privacy-policy",
        element: <Privacy></Privacy>
      },
      {
        path: "/terms-conditions",
        element: <Terms></Terms>
      },
      {
        path: "/faq",
        element: <Faq></Faq>
      },
      {
        path: "/blog",
        element: <Blog></Blog>
      },
      {
        path: "/categories",
        element: <Categories></Categories>
      },
      {
        path: "/login",
        element: <RedirectIfAuth><Login></Login></RedirectIfAuth>
      },
      {
        path: "/register",
        element: <RedirectIfAuth><Register></Register></RedirectIfAuth>
      },
      {
        path: "/forget-password",
        element: <ForgetPassword></ForgetPassword>
      },
      // User Profile
      {
        path: "/profile",
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: "/user-settings",
        element: <PrivateRoute><Settings></Settings></PrivateRoute>
      },
      {
        path: "/upload-image",
        element: <PrivateRoute><UploadImage></UploadImage></PrivateRoute>
      },
      {
        path: "/license",
        element: <License></License>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
