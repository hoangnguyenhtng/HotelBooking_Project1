import Review from './components/Review';
import React, { useState } from 'react';
import RatingsOverview from './components/RatingsOverview';
import UserRatingsSelector from './components/UserRatingsSelector';
import Toast from 'components/ux/toast/Toast';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import Loader from 'components/ux/loader/loader';
import ApiService from 'services/ApiService';

/**
 * Renders the user reviews component.
 *
 * @component
 * @param {Object} reviewData - The review data object.
 * @returns {JSX.Element} The user reviews component.
 */
const UserReviews = ({
  reviewData,
  handlePageChange,
  handlePreviousPageChange,
  handleNextPageChange,
}) => {
  const [userRating, setUserRating] = useState(0);

  const [userReview, setUserReview] = useState('');

  const [shouldHideUserRatingsSelector, setShouldHideUserRatingsSelector] =
    useState(false);

  const [toastMessage, setToastMessage] = useState('');

  /**
   * Handles the selected user rating.
   * @param {number} rate - The rating value.
   */
  const handleRating = (rate) => {
    setUserRating(rate);
  };

  const clearToastMessage = () => {
    setToastMessage('');
  };

  const handleReviewSubmit = async () => {
    if (userRating === 0) {
      setToastMessage({
        type: 'error',
        message: 'Please select a rating before submitting.',
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    console.log('userId', userId);
    if (!userId) {
      setToastMessage({
        type: 'error',
        message: 'User not authenticated.',
      });
      return;
    }

    const hotelId = 1; // Thay thế bằng giá trị hotelId thực tế của bạn
    const reviewData = {
        rating: userRating,
        review: userReview,
        comment: userReview,
        title: new Date().toLocaleDateString(),
    };

    try {
        const response = await ApiService.addReview(userId, hotelId, reviewData);
        if (response && response.errors.length === 0 && response.data.status) {
            setToastMessage({
                type: 'success',
                message: response.data.status,
            });
        } else {
            setToastMessage({
                type: 'error',
                message: 'Error adding review.',
            });
        }
    } catch (error) {
        console.error('Error adding review:', error);
        if (error.response && error.response.status === 403) {
            setToastMessage({
                type: 'error',
                message: 'You can only review rooms you have booked and checked in.',
            });
        } else {
            setToastMessage({
                type: 'error',
                message: `Error adding review: ${error.message}`,
            });
        }
    }
    setShouldHideUserRatingsSelector(true);
  };

  const handleUserReviewChange = (review) => {
    setUserReview(review);
  };

  const isEmpty = reviewData.data.length === 0;

  return (
    <div className="flex flex-col p-4 border-t">
      <h1 className="text-xl font-bold text-gray-700">Khách hàng đánh giá</h1>
      <div className="flex flex-col md:flex-row py-4 bg-white shadow-sm gap-6">
        {reviewData.data.length === 0 ? (
          <div className="w-3/5">
            <span className="text-gray-500 italic">
              Hãy là người đầu tiên để lại đánh giá!
            </span>
          </div>
        ) : (
          <RatingsOverview
            averageRating={reviewData.metadata.averageRating}
            ratingsCount={reviewData.metadata.totalReviews}
            starCounts={reviewData.metadata.starCounts}
          />
        )}
        {shouldHideUserRatingsSelector ? null : (
          <UserRatingsSelector
            userRating={userRating}
            isEmpty={isEmpty}
            handleRating={handleRating}
            userReview={userReview}
            handleReviewSubmit={handleReviewSubmit}
            handleUserReviewChange={handleUserReviewChange}
          />
        )}
      </div>
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          dismissError={clearToastMessage}
        />
      )}
      <div>
        {reviewData.isLoading ? (
          <Loader height={'600px'} />
        ) : (
          <div>
            {reviewData.data.map((review, index) => (
              <Review
                key={index}
                reviewerName={review.reviewerName}
                reviewDate={review.date}
                review={review.review}
                rating={review.rating}
                verified={review.verified}
              />
            ))}
          </div>
        )}
      </div>
      {reviewData.data.length > 0 && (
        <PaginationController
          currentPage={reviewData.pagination.currentPage}
          totalPages={reviewData.pagination.totalPages}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
        />
      )}
    </div>
  );
};

export default UserReviews;
