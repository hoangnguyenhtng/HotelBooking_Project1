import React, { useEffect, useState } from 'react';
import ReactImageGallery from 'react-image-gallery';
import PropTypes from 'prop-types';
import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import ApiService from 'services/ApiService';

const HotelDetailsViewCard = ({
  hotelDetails: {
    hotelCode = '',
    title = '',
    subtitle = '',
    images = [],
    description = [],
    benefits = [],
    discount = ''
  } = {}
}) => {
  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
    metadata: {},
    pagination: {}
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  useEffect(() => {
    if (!hotelCode) return;

    const fetchHotelReviews = async () => {
      try {
        const response = await ApiService.getHotelReviews(hotelCode, currentReviewsPage);
        if (response) {
          setReviewData({
            isLoading: false,
            data: response.elements || [],
            metadata: response.metadata || {},
            pagination: response.paging || {}
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load reviews'
        }));
      }
    };

    fetchHotelReviews();
  }, [hotelCode, currentReviewsPage]);

  if (!hotelCode) {
    return <div>No hotel information available</div>;
  }

  const formattedImages = images.map((image) => ({
    original: image.imageUrl,
    thumbnail: image.imageUrl,
    thumbnailClass: 'h-[80px]',
    thumbnailLoading: 'lazy',
  }));

  return (
    <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
      <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
        <div>
          {formattedImages.length > 0 ? (
            <div className="relative w-full">
              <ReactImageGallery
                items={formattedImages}
                showPlayButton={false}
                showFullscreenButton={false}
              />
              {discount && (
                <div className="absolute top-0 right-0 m-4 px-2 py-1 bg-yellow-500 text-white font-semibold text-xs rounded">
                  {discount} OFF
                </div>
              )}
            </div>
          ) : (
            <div className="h-[400px] bg-gray-200 flex items-center justify-center">
              <p>No images available</p>
            </div>
          )}

          <div className="p-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {title || 'Hotel Name Not Available'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {subtitle || 'Hotel Information Not Available'}
            </p>
            <div className="mt-2 space-y-2">
              {description.map((line, index) => (
                <p key={index} className="text-gray-700">
                  {line}
                </p>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">
                  {benefits.join(' | ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <UserReviews
          reviewData={reviewData}
          onPageChange={setCurrentReviewPage}
          currentPage={currentReviewsPage}
        />
      </div>

      {hotelCode && (
        <HotelBookingDetailsCard hotelCode={hotelCode} />
      )}
    </div>
  );
};

HotelDetailsViewCard.propTypes = {
  hotelDetails: PropTypes.shape({
    hotelCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string.isRequired
      })
    ),
    description: PropTypes.arrayOf(PropTypes.string),
    benefits: PropTypes.arrayOf(PropTypes.string),
    discount: PropTypes.string
  })
};

export default HotelDetailsViewCard;