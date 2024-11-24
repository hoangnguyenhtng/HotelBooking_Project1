import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from 'services/ApiService';
import Pagination from 'components/Pagination';
import RoomResult from 'components/RoomResult';
import './option.css';

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        const allRooms = response.roomList;
        setRooms(allRooms);
        setFilteredRooms(allRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (e) => {
    setSelectedRoomType(e.target.value);
    filterRooms(e.target.value);
  };

  const filterRooms = (type) => {
    if (type === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === type);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
  <div className='all-rooms'>
    <style>
      {`
        /* General Styles */
        .all-rooms {
          padding: 20px;
          font-family: Arial, sans-serif;
          color: #333;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #444;
        }

        /* Filter Section */
        .all-room-filter-div {
          margin-bottom: 20px;
        }

        .filter-select-div {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .filter-select-div label {
          font-weight: bold;
        }

        .filter-select-div select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .filter-select-div .add-room-button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .filter-select-div .add-room-button:hover {
          background-color: #0056b3;
        }

        /* Room Results */
        .room-result-container {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 10px;
        }

        .pagination button {
          padding: 8px 12px;
          border: 1px solid #ccc;
          background-color: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination button:hover {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination .active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
          font-weight: bold;
        }

        /* Add Responsive Design */
        @media (max-width: 768px) {
          .filter-select-div {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .add-room-button {
            align-self: flex-start;
          }
        }
      `}
    </style>

    <h2>Tất cả phòng</h2>
    <div
      className='all-room-filter-div'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div className='filter-select-div'>
        <label>Lọc phòng qua mã đặt phòng:</label>
        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
          <option value=''>Tất cả</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className='add-room-button'
          onClick={() => navigate('/admin/add-room')}
        >
          Thêm phòng
        </button>
      </div>
    </div>

    <RoomResult roomSearchResults={currentRooms} />

    <Pagination
      roomsPerPage={roomsPerPage}
      totalRooms={filteredRooms.length}
      currentPage={currentPage}
      paginate={paginate}
    />
  </div>
);

};

export default ManageRoomPage;
