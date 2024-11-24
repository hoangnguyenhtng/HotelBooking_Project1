import axios from "axios"

export default class ApiService {

  static BASE_URL = "http://localhost:4040"

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }


  static async getUserProfile() {
    try{
      const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`)
      return response.data
    } catch (error) {
      console.error("Error fetching user profile", error);
      throw error;
    }
    
  }

  /**AUTH */

  /* This  register a new user */
  static async registerUser(registration) {
    const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
    return response.data
  }

  /* This  login a registered user */
  static async loginUser(loginDetails) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
    return response.data
  }

  static async forgotPassword(email) {
    try {
      console.log(email);
      const response = await axios.post(`${this.BASE_URL}/auth/forgot-password`, {
        email: email
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  }

  static async changePassword(passwordDetails) {
    try {
      const token = localStorage.getItem('token'); // Adjust this line to get the token from your storage
      const response = await axios.post(
        `${this.BASE_URL}/users/change-password`,
        passwordDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error changing password:", error.response.data);
      } else if (error.request) {
        console.error("Error changing password: No response received", error.request);
      } else {
        console.error("Error changing password:", error.message);
      }
      throw error;
    }
  }

  /* Phương thức đặt lại mật khẩu với mã xác thực */
  static async resetPassword(resetCode, newPassword) {
    try {
      const response = await axios.post(`${this.BASE_URL}/auth/reset-password`, {
        resetCode: resetCode,
        newPassword: newPassword
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  /* This verifies user email with token */
  static async verifyEmail(token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/auth/verify/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying email:", error);
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const response = await axios.get(`${this.BASE_URL}/auth/verify/${token}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying email:", error);
      throw error;
    }
  }

  /* This resends verification email */
  static async resendVerification(email) {
    try {
      const response = await axios.post(`${this.BASE_URL}/auth/resend-verification`, null, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error("Error resending verification email:", error);
      throw error;
    }
  }

  /* This resends verification email */
  static async resendVerification(email) {
    try {
      const response = await axios.post(`${this.BASE_URL}/auth/resend-verification`, null, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error("Error resending verification email:", error);
      throw error;
    }
  }


  /* Get all cities */
  static async getAllCities() {
    try {
      const response = await axios.get(`${this.BASE_URL}/cities/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  }

  static async getAllHotels() {
    try {
      const response = await axios.get(`${this.BASE_URL}/hotels/all`);
      // Đảm bảo trả về response.data
      return response.data;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      throw error;
    }
  }

  /* This gets hotels by city id */
  static async getHotelsByCityId(cityId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/hotels/by-city/${cityId}`);
      // Đảm bảo trả về response.data
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotels for city ${cityId}:`, error);
      throw error;
    }
  }

  /* This gets hotels by city id */
  static async getHotelsById(cityId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/hotels/${cityId}`);
      // Đảm bảo trả về response.data
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotels for city ${cityId}:`, error);
      throw error;
    }
  }

  static async getHotelsById(hotelId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/hotels/${hotelId}`);
      // Transform data từ response
      const hotel = response.data.hotel;

      return {
        hotelCode: hotel.id,
        title: hotel.name,
        images: [
          {
            imageUrl: hotel.url
          },
          {
            imageUrl: "https://images.pexels.com/photos/949406/pexels-photo-949406.jpeg?auto=compress&cs=tinysrgb&w=600"
          },
          {
            imageUrl: "https://images.pexels.com/photos/302831/pexels-photo-302831.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
        ],
        subtitle: "Khách sạn cao cấp giá tốt tại Hà Nội",
        description: [
          hotel.description
        ],
        benefits: ["Free WiFi", "Swimming Pool", "Spa", "Fine Dining"],
        discount: "20%",
        averageRating: hotel.averageRating,
        totalReviews: hotel.totalReviews
      };
    } catch (error) {
      console.error(`Error fetching hotel with ID ${hotelId}:`, error);
      throw error;
    }
  }
  // review
  static getUserId() {
    return localStorage.getItem('userId');
  }
  static async getHotelReviews(hotelId, currentPage = 1, size = 10) {
    try {
      const response = await axios.get(`${this.BASE_URL}/hotels/${hotelId}`, {
        params: { page: currentPage, size },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel reviews:', error);
      throw error;
    }
  }

  static async addReview(userId, hotelId, reviewDTO) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/reviews/hotels/${userId}/${hotelId}`,
        reviewDTO
      );
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  static async getBookingDetails(hotelCode) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/hotel/${hotelCode}/booking/enquiry`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  /***USERS */


  /*  This is  to get the user profile */
  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader()
    })
    return response.data
  }

  static async getUserProfile() {
    const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
      headers: this.getHeader()
    })
    return response.data
  }


  /* This is the  to get a single user */
  static async getUser(userId) {
    const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
      headers: this.getHeader()
    })
    return response.data
  }

  /* This is the  to get user bookings by the user id */
  static async getUserBookings(userId) {
    if (!userId) {
      throw new Error("User ID is required to fetch bookings");
    }
    const headers = this.getHeader();
    console.log("Request headers:", headers);
    const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
      headers: this.getHeader()
    })
    return response.data
  }


  /* This is to delete a user */
  static async deleteUser(userId) {
    const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
      headers: this.getHeader()
    })
    return response.data
  }

  /**ROOM */
  /* This  adds a new room room to the database */
  static async addRoom(formData) {
    const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
      headers: {
        ...this.getHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return result.data;
  }

  /* This  gets all availavle rooms */
  static async getAllAvailableRooms() {
    const result = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`)
    return result.data
  }


  /* This  gets all availavle by dates rooms from the database with a given date and a room type */
  static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
    const result = await axios.get(
      `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
    )
    return result.data
  }

  /* This  gets all room types from thee database */
  static async getRoomTypes() {
    const response = await axios.get(`${this.BASE_URL}/rooms/types`)
    return response.data
  }
  /* This  gets all rooms from the database */
  static async getAllRooms() {
    const result = await axios.get(`${this.BASE_URL}/rooms/all`)
    return result.data
  }
  /* This funcction gets a room by the id */
  static async getRoomById(roomId) {
    const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`)
    return result.data
  }

  /* This  deletes a room by the Id */
  static async deleteRoom(roomId) {
    const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader()
    })
    return result.data
  }

  /* This updates a room */
  static async updateRoom(roomId, formData) {
    const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
      headers: {
        ...this.getHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return result.data;
  }


  /**BOOKING */
  /* This  saves a new booking to the databse */
  static async bookRoom(roomId, userId, booking) {

    console.log("USER ID IS: " + userId)

    const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
      headers: this.getHeader()
    })
    return response.data
  }

  /* This  gets all bookings from the database */
  static async getAllBookings() {
    const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
      headers: this.getHeader()
    })
    return result.data
  }

  /* This  get booking by the confirmation code */
  static async getBookingByConfirmationCode(bookingCode) {
    const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`)
    return result.data
  }

  /* This is the  to cancel user booking */
  static async cancelBooking(bookingId) {
    const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
      headers: this.getHeader()
    })
    return result.data
  }

  /* This is the API to get city by IP */
  static async getCityByIp(ip) {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXJyeWZyZWVtYW42MjhAZ21haWwuY29tIiwiaWF0IjoxNzMyNDU3Njk3LCJleHAiOjE3MzI1MDA4OTd9.ea1XDapJWG8K29XtfMtGDRzpVNB5x1sZYF6mFkJwsvU'; // Thay thế bằng token riêng của bạn
    const result = await axios.get(`${this.BASE_URL}/location`, {
      params: { ip },
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    });
    return result.data;
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }

  static isAdmin() {
    const role = localStorage.getItem('role')
    return role === 'ADMIN'
  }

  static isUser() {
    const role = localStorage.getItem('role')
    return role === 'USER'
  }
}
// export default new ApiService();

