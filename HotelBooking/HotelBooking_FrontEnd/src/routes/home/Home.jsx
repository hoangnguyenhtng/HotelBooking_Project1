import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import axios from 'axios';
import ApiService from 'services/ApiService';
import ResultsContainer from 'components/results-container/ResultsContainer';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import HotelView from './HotelView'; // Import HotelView từ file mới
import Chat from 'components/Chat';
import ChatWidget from 'routes/chat/ChatWidget';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Section = styled.section`
  padding: 20px;
  background-color: #f9f9f9;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: center;
  margin-bottom: 10px;
  padding: 20px;
  margin-left: 45px;
  background-color: #084499; /* Màu nền trùng với navbar */
`;

const SearchField = styled.div`
  flex: 0 0 calc(20% - 10px);
  margin: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const DateField = styled(SearchField)`
  flex: 0 0 calc(15% - 10px);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  margin-left: 10px;
  padding: 15px 20px;
  background-color: #ccae37; /* Màu nền mới */
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #b89732; /* Màu nền khi hover */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1rem;
  text-align: center;
  margin-top: 20px;
`;

const NoRoomsMessage = styled.p`
  color: red;
  font-size: 1rem;
  text-align: center;
  margin-top: 20px;
`;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [locationInputValue, setLocationInputValue] = useState(searchParams.get('city') || '');
  const [numGuestsInputValue, setNumGuestsInputValue] = useState(searchParams.get('numGuests') || '');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [hotel, setHotel] = useState('');
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]); // Đảm bảo availableRooms luôn có giá trị mặc định
  const [isLoading, setIsLoading] = useState(false); // Đảm bảo isLoading luôn có giá trị mặc định
  const [currentResultsPage, setCurrentResultsPage] = useState(1);
  const [noRoomsMessage, setNoRoomsMessage] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [hotelsResults, setHotelsResults] = useState([]); // Định nghĩa hotelsResults
  const [userIp, setUserIp] = useState(''); // Định nghĩa userIp
  const [nearbyHotels, setNearbyHotels] = useState([]); // Định nghĩa nearbyHotels
  const [isNearby, setIsNearby] = useState(false); // Định nghĩa isNearby

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cities, roomTypes] = await Promise.all([
          ApiService.getAllCities(),
          ApiService.getRoomTypes(),
        ]);
        setCities(cities);
        setRoomTypes(roomTypes);

        // Yêu cầu quyền truy cập vị trí
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async () => {
              // Người dùng cho phép truy cập vị trí
              const response = await axios.get('https://api.ipify.org?format=json');
              console.log('IP:', response.data.ip);
              const ip = response.data.ip;
              setUserIp(ip);

              const city = await ApiService.getCityByIp(ip);
              let cityId = null;
              if (city.toLowerCase() === 'hoàn kiếm' || city.toLowerCase() === 'hanoi') {
                cityId = 1;
              } else {
                const matchedCity = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
                if (matchedCity) {
                  cityId = matchedCity.id;
                }
              }

              if (cityId) {
                setCity(cityId);
                setLocationInputValue(cityId); // Cập nhật locationInputValue để tự động chọn thành phố
                fetchHotelsByCityId(cityId);
                setIsNearby(true); // Đặt isNearby thành true khi lấy được thành phố
              }
            },
            () => {
              // Người dùng từ chối truy cập vị trí
              console.log('Người dùng từ chối truy cập vị trí');
            }
          );
        } else {
          console.log('Trình duyệt không hỗ trợ Geolocation');
        }

        // Fetch top rate hotels
        const topRateHotels = await ApiService.getAllHotels();
        setHotelsResults(topRateHotels);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ban đầu:', error.message);
        setError('Lỗi khi lấy dữ liệu ban đầu. Vui lòng thử lại sau.');
      }
    };

    fetchInitialData();
  }, []);

  const fetchHotelsByCityId = async (cityId) => {
    try {
      const hotels = await ApiService.getHotelsByCityId(cityId);
      setHotels(hotels);
      setNearbyHotels(hotels); // Cập nhật nearbyHotels khi lấy được danh sách khách sạn theo thành phố
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách khách sạn cho thành phố ${cityId}:`, error.message);
      setNearbyHotels([]); // Reset nearbyHotels array khi có lỗi
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setLocationInputValue(selectedCity); // Cập nhật locationInputValue khi đổi thành phố
    setHotel(''); // Reset lựa chọn khách sạn khi đổi thành phố
    fetchHotelsByCityId(selectedCity);
    setIsNearby(false); // Đặt isNearby thành false khi người dùng tự chọn thành phố
  };

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType || !city || !hotel) {
      showError('Vui lòng chọn tất cả các trường');
      return false;
    }
    setIsLoading(true);
    setNoRoomsMessage(false);
    try {
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
      const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          setNoRoomsMessage(true);
          setTimeout(() => {
            setNoRoomsMessage(false);
          }, 3000);
          setIsLoading(false);
          return;
        }
        setAvailableRooms(response.roomList);
        setError('');
        setShowAvailableRooms(true); // Hiển thị "Các phòng phù hợp" khi tìm kiếm thành công
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError("Lỗi không xác định: " + error.message);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentResultsPage(page);
    // Thêm logic để lấy kết quả cho trang mới
  };

  const handlePreviousPageChange = () => {
    if (currentResultsPage > 1) {
      setCurrentResultsPage(currentResultsPage - 1);
      // Thêm logic để lấy kết quả cho trang trước
    }
  };

  const handleNextPageChange = () => {
    if (currentResultsPage < availableRooms.pagination?.totalPages) {
      setCurrentResultsPage(currentResultsPage + 1);
      // Thêm logic để lấy kết quả cho trang tiếp theo
    }
  };

  const onSearchButtonAction = () => {
    setSearchParams({
      city: locationInputValue,
      numGuests: numGuestsInputValue,
    });
    handleInternalSearch();
  };

  const handleBookNowClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <Section>
      <SearchContainer>
        <SearchField>
          <Label>Thành phố</Label>
          <Select value={locationInputValue} onChange={handleCityChange}>
            <option disabled value="">
              Chọn thành phố
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </SearchField>
        <SearchField>
          <Label>Khách sạn</Label>
          <Select value={hotel} onChange={(e) => setHotel(e.target.value)} disabled={!city}>
            <option disabled value="">
              Chọn khách sạn
            </option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </Select>
        </SearchField>
        <DateField>
          <Label>Ngày nhận phòng</Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Chọn ngày nhận phòng"
            customInput={<Input />}
          />
        </DateField>
        <DateField>
          <Label>Ngày trả phòng</Label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Chọn ngày trả phòng"
            customInput={<Input />}
          />
        </DateField>
        <SearchField>
          <Label>Loại phòng</Label>
          <Select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option disabled value="">
              Chọn loại phòng
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </Select>
        </SearchField>
        <Button onClick={onSearchButtonAction}>Tìm phòng</Button>
      </SearchContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {noRoomsMessage && <NoRoomsMessage>Không có phòng nào phù hợp.</NoRoomsMessage>}
      <div className="container mx-auto">
        <div className="my-8">
          {showAvailableRooms && (
            <>
              <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
                Các phòng phù hợp
              </h2>
              {/* Display room search results */}
              {availableRooms.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map(room => (
                    <div key={room.id} className="border rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={room.roomPhotoUrl}
                        alt={room.roomDescription}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">{room.roomType}</h3>
                        <p className="text-gray-600">{room.roomDescription}</p>
                        <p className="text-gray-800 font-bold">{room.roomPrice} VND / 1 đêm</p>
                        <button
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
                          onClick={() => handleBookNowClick(room.id)}
                        >
                          Đặt phòng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          

          {/* Display nearby hotels */}
          <h2 className="text-3xl font-medium text-slate-700 text-center my-8">
            {isNearby ? 'Khách sạn gần bạn' : 'Các khách sạn được đánh giá cao nhất'}
          </h2>
          <div className="flex flex-col gap-4">
            {(isNearby ? nearbyHotels : hotelsResults).slice(0, 7).map(hotel => (
              <HotelView
                key={hotel.id}
                id={hotel.id}
                image={{ imageUrl: hotel.url, accessibleText: hotel.name }}
                title={hotel.name}
                subtitle={hotel.description}
                benefits={['Wifi và 5G miễn phí', 'Đã bao gồm bữa sáng']}
                price={hotel.price || 0}
                ratings={hotel.averageRating || 4.5}
                onBookNowClick={() => handleBookNowClick(hotel.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>

            
  );
};

export default Home;