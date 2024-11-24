import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ApiService from 'services/ApiService';
import { useNavigate } from 'react-router-dom';

const HotelBookingDetailsCard = ({ hotelCode = '', roomId = '', userId = '' }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAdults, setSelectedAdults] = useState({ value: 2, label: '2 adults' });
  const [selectedChildren, setSelectedChildren] = useState({ value: 0, label: '0 children' });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomOptions, setRoomOptions] = useState([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomTypes = await ApiService.getRoomTypes();
        const formattedRoomTypes = roomTypes.map(type => ({ value: type, label: type }));
        setRoomOptions(formattedRoomTypes);
      } catch (error) {
        console.error('Failed to fetch room types:', error);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };

  const handleAdultsChange = (selectedOption) => {
    setSelectedAdults(selectedOption);
  };

  const handleChildrenChange = (selectedOption) => {
    setSelectedChildren(selectedOption);
  };

  const onFilterRooms = async () => {
    if (!selectedRoom) {
      setErrorMessage('Please select a room type.');
      return;
    }

    try {
      const filterData = {
        roomType: selectedRoom.value,
        numAdult: selectedAdults.value.toString(),
        numChild: selectedChildren.value.toString(),
      };

      // Chuyển hướng trực tiếp đến trang room-details-book/1
      navigate('/room-details-book/1', {
        // Nếu bạn vẫn muốn truyền dữ liệu filter qua route
        state: {
          filterData: filterData
        },
      });

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to filter rooms. Please try again.');
    }
  };

  const onBookingConfirm = async () => {
    if (!selectedRoom) {
      setErrorMessage('Please select a room type.');
      return;
    }

    try {
      const bookingData = {
        roomType: selectedRoom.value,
        numAdult: selectedAdults.value.toString(),
        numChild: selectedChildren.value.toString(),
      };

      const response = await ApiService.bookRoom(roomId, userId, bookingData);

      if (response) {
        navigate('/booking-success', {
          state: {
            bookingDetails: response,
          },
        });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to book room. Please try again.');
    }
  };

  const dismissError = () => {
    setErrorMessage('');
  };

  const adultOptions = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: `${i + 1} adult${i > 0 ? 's' : ''}` }));
  const childrenOptions = Array.from({ length: 5 }, (_, i) => ({ value: i, label: `${i} child${i !== 1 ? 'ren' : ''}` }));

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Chọn phòng theo tiêu chí:</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        <div className="mb-4">
          <div className="font-semibold text-gray-800 mb-2">Số khách:</div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">Người lớn:</label>
            <Select
              value={selectedAdults}
              onChange={handleAdultsChange}
              options={adultOptions}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Trẻ em:</label>
            <Select
              value={selectedChildren}
              onChange={handleChildrenChange}
              options={childrenOptions}
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Loại phòng: </div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
          />
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        
        <button
          onClick={onFilterRooms}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300 mt-2"
        >
          Tìm phòng phù hợp nhất
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;