import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import ApiService from 'services/ApiService';

/**
 * Represents the hotel details component.
 * @component
 * @returns {JSX.Element} The hotel details component.
 */
const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotelDetails, setHotelDetails] = useState({
    isLoading: true,
    data: {},
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const data = await ApiService.getHotelsById(1); 
        setHotelDetails(data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetails();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Chỉ render component khi có data
  if (!hotelDetails) {
    return <div>Không có khách sạn thỏa mãn</div>;
  }

  return <HotelDetailsViewCard hotelDetails={hotelDetails} />;
};


export default HotelDetails;
