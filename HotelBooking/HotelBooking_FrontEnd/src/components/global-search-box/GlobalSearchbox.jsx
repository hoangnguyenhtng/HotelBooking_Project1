import {
  faChildren,
  faLocationDot,
  faPerson,
} from '@fortawesome/free-solid-svg-icons';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import Input from 'components/ux/input/Input';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import ApiService from 'services/ApiService';  // Updated import

/**
 * GlobalSearchBox Component
 * Renders a search box with input fields for location, number of guests, and a date range picker.
 * It includes a search button to trigger the search based on the entered criteria.
 */
const GlobalSearchBox = (props) => {
  const [city, setCity] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getAllCities();
        if (response) {
          const mappedValues = response.map((city) => ({
            label: city.name,
            value: city.id, // Sử dụng city.id làm value
          }));
          setCity(mappedValues);
        }
      } catch (error) {
        setError('Error fetching cities');
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Function to fetch hotels when a city is selected
  const handleCityChange = async (selectedCity) => {
    if (selectedCity) {
      try {
        setLoading(true);
        const response = await ApiService.getHotelsByCityId(selectedCity.value); // Sử dụng cityId
        if (response) {
          if (!Array.isArray(response)) {
            throw new TypeError('Expected an array of hotels');
          }
          const mappedHotels = response.map((hotel) => ({
            label: hotel.name,
            value: hotel.id,
          }));
          setHotels(mappedHotels);
        }
      } catch (error) {
        setError('Error fetching hotels');
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleAdultCountChange = (value) => {
    setAdultCount(parseInt(value) || 0);
  };

  const handleChildCountChange = (value) => {
    setChildCount(parseInt(value) || 0);
  };

  const totalGuests = adultCount + childCount;

  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    onDatePickerIconClick,
    locationTypeheadResults,
    onSearchButtonAction,
    onDateChangeHandler,
    setisDatePickerVisible,
    dateRange,
  } = props;

  return (
    <Row className="align-items-end justify-content-end">
      <Col xs={2} className="px-0">
        <Select
          options={city}
          className="stay-booker__input w-full capitalize spaces border-end-0"
          placeholder="Chọn khu vực"
          isLoading={loading}
          onChange={handleCityChange}
        />
      </Col>
      <Col xs={2} className="px-0">
        <Select
          options={hotels}
          className="stay-booker__input w-full capitalize spaces border-end-0"
          placeholder="Chọn khách sạn"
          isLoading={loading}
        />
      </Col>
      <Col xs={3} className="px-0">
        <DateRangePicker
          isDatePickerVisible={isDatePickerVisible}
          onDatePickerIconClick={onDatePickerIconClick}
          onDateChangeHandler={onDateChangeHandler}
          setisDatePickerVisible={setisDatePickerVisible}
          dateRange={dateRange}
        />
      </Col>
      <Col xs={2} className="px-0">
        <div className="d-flex">
          <Input
            size="sm"
            value={adultCount}
            onChangeInput={handleAdultCountChange}
            placeholder="Người lớn"
            icon={faPerson}
            classes='border-end-0 border-start-0'
          />
          <Input
            size="sm"
            value={childCount}
            onChangeInput={handleChildCountChange}
            placeholder="Trẻ em"
            className="flex-2"
            icon={faChildren}
          />
        </div>
      </Col>
      <Col xs={2} className="px-1">
        <button
          className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 py-7 spaces px-16 text-white"
          onClick={onSearchButtonAction}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Tìm kiếm'}
        </button>
      </Col>
      {error && (
        <div className="text-red-500 mt-2 text-sm">
          {error}
        </div>
      )}
    </Row>
  );
};

export default GlobalSearchBox;