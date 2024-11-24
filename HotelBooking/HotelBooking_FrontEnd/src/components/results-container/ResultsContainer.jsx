import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faSnowflake, faTv, faGlassMartiniAlt, faConciergeBell } from '@fortawesome/free-solid-svg-icons';

const ResultsContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const RoomCard = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const RoomImage = styled.img`
  width: 200px;
  height: auto;
  object-fit: cover;
`;

const RoomDetails = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const RoomType = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 8px;
`;

const RoomNumber = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0 0 8px;
`;

const RoomDescription = styled.p`
  font-size: 1rem;
  color: #777;
  margin: 0 0 16px;
`;

const RoomPrice = styled.p`
  font-size: 1.25rem;
  color: #007BFF;
  font-weight: bold;
  margin: 0;
`;

const RoomServicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  flex: 1;
`;

const RoomServicesTitle = styled.h4`
  font-size: 1.25rem;
  color: #007BFF;
  margin: 0 0 8px;
`;

const RoomServices = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
`;

const RoomServiceItem = styled.li`
  font-size: 1rem;
  color: #555;
  margin: 0 16px 8px 0;
  flex: 0 0 50%;
  font-style: italic;
  color: #007BFF;
`;

const BookButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  align-self: flex-end;
  &:hover {
    background-color: #0056b3;
  }
`;

const ResultsContainer = ({ availableRooms, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 90 + 10); // Tạo số ngẫu nhiên từ 10 đến 99
  };

  const handleBooking = (roomId) => {
    navigate(`/room-details-book/${roomId}`);
  };

  return (
    <ResultsContainerWrapper>
      {availableRooms && availableRooms.length > 0 ? (
        availableRooms.map((room) => (
          <RoomCard key={room.id}>
            <RoomImage src={room.roomPhotoUrl} alt={room.roomDescription} />
            <RoomDetails>
              <RoomType>{room.roomType}</RoomType>
              <RoomNumber>Số phòng: {room.id}{getRandomNumber()}</RoomNumber>
              <RoomDescription>{room.roomDescription}</RoomDescription>
              <RoomPrice>{room.roomPrice} VND / 1 đêm</RoomPrice>
            </RoomDetails>
            <RoomServicesContainer>
              <RoomServicesTitle>Tiện ích phòng</RoomServicesTitle>
              <RoomServices>
                <RoomServiceItem><FontAwesomeIcon icon={faWifi} /> Wi-Fi miễn phí</RoomServiceItem>
                <RoomServiceItem><FontAwesomeIcon icon={faSnowflake} /> Điều hòa không khí</RoomServiceItem>
                <RoomServiceItem><FontAwesomeIcon icon={faTv} /> Truyền hình cáp</RoomServiceItem>
                <RoomServiceItem><FontAwesomeIcon icon={faGlassMartiniAlt} /> Minibar</RoomServiceItem>
                <RoomServiceItem><FontAwesomeIcon icon={faConciergeBell} /> Dịch vụ phòng 24/7</RoomServiceItem>
              </RoomServices>
              <BookButton onClick={() => handleBooking(room.id)}>Đặt phòng</BookButton>
            </RoomServicesContainer>
          </RoomCard>
        ))
      ) : (
        <p></p>
      )}
    </ResultsContainerWrapper>
  );
};

ResultsContainer.propTypes = {
  availableRooms: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ResultsContainer;