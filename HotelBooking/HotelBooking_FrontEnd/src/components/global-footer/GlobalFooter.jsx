import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-slate-700 hover:text-brand transition-colors duration-300"
  >
    {label}
  </Link>
);

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 mt-6">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Thông tin</h4>
            <FooterLink to="/about-us" label="Về chúng tôi" />
            <FooterLink to="/" label="Liên hệ" />
            <FooterLink to="/" label="Điều khoản" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Hỗ trợ 24/7</h4>
            <FooterLink to="/" label="FAQs" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Bản tin</h4>
            <p>Cập nhật những trend du lịch mới nhất</p>
            <form>
              <input
                type="email"
                placeholder="Enter email"
                className="p-2 rounded"
              />
              <button className="ml-2 p-2 bg-brand text-white rounded">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p>Thiết kế và vận hành bởi</p>
          <p>
            &copy; {new Date().getFullYear()} HotelBooking.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
