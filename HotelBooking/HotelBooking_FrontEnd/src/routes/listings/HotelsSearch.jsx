import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import ApiService from 'services/ApiService';
import ResultsContainer from 'components/results-container/ResultsContainer';
import PaginationController from 'components/ux/pagination-controller/PaginationController';

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
  background-color: #007F86;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: rgb(34, 80, 128);
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

const HotelsSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationInputValue, setLocationInputValue] = useState(searchParams.get('city') || 'pune');
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
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResultsPage, setCurrentResultsPage] = useState(1);
  const [noRoomsMessage, setNoRoomsMessage] = useState(false);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Lỗi khi lấy loại phòng:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cities = await ApiService.getAllCities();
        setCities(cities);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thành phố:', error.message);
      }
    };
    fetchCities();
  }, []);

  const fetchHotelsByCityId = async (cityId) => {
    try {
      const hotels = await ApiService.getHotelsByCityId(cityId);
      setHotels(hotels);
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách khách sạn cho thành phố ${cityId}:`, error.message);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    fetchHotelsByCityId(selectedCity);
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

  return (
    <Section>
      <SearchContainer>
        
        <SearchField>
          <Label>Thành phố</Label>
          <Select value={city} onChange={handleCityChange}>
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
          <Select value={hotel} onChange={(e) => setHotel(e.target.value)}>
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
      <ResultsContainer availableRooms={availableRooms} isLoading={isLoading} />
      {availableRooms.pagination?.totalPages > 1 && (
        <div className="my-4">
          <PaginationController
            currentPage={currentResultsPage}
            totalPages={availableRooms.pagination?.totalPages}
            handlePageChange={handlePageChange}
            handlePreviousPageChange={handlePreviousPageChange}
            handleNextPageChange={handleNextPageChange}
          />
        </div>
      )}
    </Section>
  );
};

export default HotelsSearch;