import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import HotelsSearch from './routes/listings/HotelsSearch';
import UserProfile from './routes/user-profile/UserProfile';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Home from './routes/home/Home';
import { AuthProvider } from './contexts/AuthContext';
import HotelDetails from './routes/hotel-details/HotelDetails';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import AboutUs from './routes/about-us/AboutUs';
import BaseLayout from './routes/layouts/base-layout/BaseLayout';
import ForgotPassword from './routes/forgot-password/ForgotPassword';
import Checkout from 'routes/checkout/Checkout';
import BookingConfirmation from 'routes/booking-confimation/BookingConifrmation';
import 'bootstrap/dist/css/bootstrap.min.css';
import ResetPassword from 'routes/forgot-password/ResetPassword';
import EmailVerification from 'routes/register/EmailVerification';
import RoomDetailsPage from 'routes/room/RoomDetailsPage'; // Import RoomDetailsPage
import HotelView from 'routes/home/HotelView';
import Blog from 'routes/Blog/Blog';
import AdminPage from 'routes/admin/AdminPage';
import ManageRoomPage from 'routes/admin/ManageRoomPage';
import ManageBookingsPage from 'routes/admin/ManageBookingsPage';
import AddRoomPage from 'routes/admin/AddRoomPage';
import EditRoomPage from 'routes/admin/EditRoomPage';
import EditBookingPage from 'routes/admin/EditBookingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'hotels',
        element: <HotelsSearch />,
      },
      {
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'admin/manage-rooms',
        element: <ManageRoomPage />,
      },
      {
        path: 'admin/manage-bookings',
        element: <ManageBookingsPage />,
      },
      {
        path: 'user-profile',
        element: <UserProfile />,
      },
      {
        path: 'admin/add-room',
        element: <AddRoomPage />,
      },
      {
        path: 'admin/edit-room/:roomId',
        element: <EditRoomPage />,
      },
      {
        path: 'admin/edit-booking/:bookingCode',
        element: <EditBookingPage />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'hotel-view',
        element: <HotelView />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'hotel/:hotelId',
        element: <HotelDetails />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: '/verify-email/:token' ,
        element : <EmailVerification />,
      },
      {
        path: 'booking-confirmation',
        element: <BookingConfirmation />,
      },
      {
        path: 'room-details-book/:roomId',
        element: <RoomDetailsPage />, // Add this line
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

reportWebVitals();