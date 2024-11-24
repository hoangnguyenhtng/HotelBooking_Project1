// ContactUs.js
import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import banner1 from './banner1.jpg'

const AboutUs = () => {
  const [email, setEmail] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscription = (e) => {
    e.preventDefault();
    // Ở đây bạn có thể tích hợp API để xử lý đăng ký email
    console.log('Subscribed Email:', email);
    setSubscriptionMessage('Cảm ơn bạn đã đăng ký nhận thông tin khuyến mãi!');
    setEmail('');
    // Đặt timeout để ẩn thông báo sau vài giây
    setTimeout(() => {
      setSubscriptionMessage('');
    }, 5000);
  };

  // Định nghĩa các styles dưới dạng đối tượng JavaScript
  const styles = {
    contactContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#555',
    },
    section: {
      marginBottom: '40px',
    },
    heading1: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '20px',
    },
    heading2: {
      fontSize: '2rem',
      color: '#333',
      marginTop: '30px',
      marginBottom: '15px',
    },
    paragraph: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
    },
    list: {
      listStyleType: 'disc',
      marginLeft: '20px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    linkHover: {
      textDecoration: 'underline',
    },
    subscriptionSection: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    },
    subscriptionForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    subscriptionInput: {
      padding: '10px',
      fontSize: '1rem',
      width: '100%',
      maxWidth: '400px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    subscriptionButton: {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    subscriptionButtonHover: {
      backgroundColor: '#0056b3',
    },
    subscriptionMessage: {
      marginTop: '10px',
      color: 'green',
      fontWeight: 'bold',
    },
    socialIcons: {
      marginTop: '30px',
    },
    socialIconsHeading: {
      marginBottom: '15px',
      color: '#333',
    },
    iconsWrapper: {
      display: 'flex',
      gap: '15px',
    },
    socialIcon: {
      color: '#555',
      transition: 'color 0.3s ease',
      textDecoration: 'none',
    },
    socialIconHover: {
      color: '#007bff',
    },
    hotline: {
      fontWeight: 'bold',
    },
    aboutImage: {
      width: '100%', // hoặc kích thước mong muốn
      height: 'auto',
      marginBottom: '20px',
      borderRadius: '8px',
    },

  };

  return (
    <div style={styles.contactContainer}>
      {/* About Us Section */}
      <section style={{ ...styles.section }}>
        <h1 style={styles.heading1}>VỀ CHÚNG TÔI</h1>
        <p style={styles.paragraph}>
          Chào mừng đến với <strong>HotelBooking</strong>, nơi chúng tôi cam kết mang đến cho bạn trải nghiệm tốt nhất khi đặt phòng khách sạn tại Việt Nam. Sứ mệnh của chúng tôi là làm cho chuyến đi của bạn trở nên thoải mái, tiện lợi và đáng nhớ.
        </p>

        <h2 style={styles.heading2}>Tầm Nhìn Của Chúng Tôi</h2>
        <p style={styles.paragraph}>
          Tại <strong>Hotel Booking</strong>, chúng tôi hình dung một Việt Nam nơi mọi du khách đều tìm thấy chỗ ở hoàn hảo phù hợp với nhu cầu và sở thích của họ. Chúng tôi mong muốn đơn giản hóa quy trình đặt phòng khách sạn, cung cấp nhiều lựa chọn cho mọi ngân sách.
        </p>
        <img
          src={banner1}
          alt="Về Chúng Tôi"
          style={styles.aboutImage}
        />

        <h2 style={styles.heading2}>Tại Sao Chọn Chúng Tôi?</h2>
        <ul style={styles.list}>
          <li>
            Chúng tôi cung cấp một loạt các khách sạn đa dạng, từ các khu nghỉ dưỡng sang trọng đến các khách sạn boutique ấm cúng, đảm bảo rằng bạn sẽ tìm thấy sự phù hợp hoàn hảo cho phong cách du lịch của mình.
          </li>
          <li>
            Với giao diện đơn giản, dễ dàng cho mọi khách hàng, tôi tin chúng tôi sẽ cung cấp các dịch vụ tốt nhất cho mọi lứa tuổi.
          </li>
          <li>
            Dịch vụ chăm sóc khách hàng 24/7 cũng là một trong những ưu điểm của chúng tôi.
          </li>
          <li>
            An ninh tốt trong bảo mật người dùng cũng là một trong những thế mạnh hàng đầu của chúng tôi.
          </li>
        </ul>
      </section>

      {/* Contact Us Section */}
      <section style={{ ...styles.section }}>
        <h1 style={styles.heading1}>Liên hệ với chúng tôi</h1>
        <p style={styles.paragraph}>
          Bạn cần một vài thông tin hoặc cần nhận những ưu đãi đặc biệt{' '}
          <a href="mailto:info@staybooker.com" style={styles.link}>
            hotelbooking@gmail.com
          </a>{' '}
          hoặc có thể gọi trực tiếp đến <span style={styles.hotline}>Hotline: 0373 486 811</span>. Chúng tôi rất vui lòng phục vụ!
        </p>
        <p style={styles.paragraph}>
          Cảm ơn vì đã lựa chọn <strong>Hotel Booking</strong>. Chúng tôi rất mong sẽ được phục vụ quý khách trong hành trình đáng nhớ của quý khách.
        </p>

        {/* Subscription Section */}
        <div style={styles.subscriptionSection}>
          <h2 style={styles.heading2}>Nhận Thông Tin Khuyến Mãi</h2>
          <form onSubmit={handleSubscription} style={styles.subscriptionForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              style={styles.subscriptionInput}
            />
            <button
              type="submit"
              style={styles.subscriptionButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = styles.subscriptionButtonHover.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = styles.subscriptionButton.backgroundColor)}
            >
              Đăng Ký
            </button>
          </form>
          {subscriptionMessage && (
            <p style={styles.subscriptionMessage}>{subscriptionMessage}</p>
          )}
        </div>

        {/* Social Icons */}
        <div style={styles.socialIcons}>
          <h2 style={styles.socialIconsHeading}>Follow Us</h2>
          <div style={styles.iconsWrapper}>
            <a
              href="https://www.facebook.com/hoangnguyenhtn/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              onMouseOver={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
              onMouseOut={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
            >
              <FaFacebook size={30} />
            </a>
            <a
              href="https://www.facebook.com/hoangnguyenhtn/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              onMouseOver={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
              onMouseOut={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://www.facebook.com/hoangnguyenhtn/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialIcon}
              onMouseOver={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
              onMouseOut={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
            >
              <FaYoutube size={30} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
