import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  background-color: #f8f8f8;
  padding: 16px;
`;

const CardTitle = styled.h4`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: 1rem;
  color: #777;
  margin: 8px 0 0;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  font-size: 0.875rem;
  color: #28a745;
  margin: 4px 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
`;

const Rating = styled.div`
  font-size: 1rem;
  color: #fff;
  background-color: #ffcc00;
  padding: 4px 8px;
  border-radius: 4px;
`;

const Price = styled.p`
  font-size: 1.25rem;
  color: #333;
  font-weight: bold;
  margin: 0;
`;

const BookButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

const HotelViewCard = ({ hotelCode, title, subtitle, benefits, ratings, price, onBookNowClick }) => {
  return (
    <Card>
      <CardHeader>
        <Link to={`/hotel/${hotelCode}`}>
          <CardTitle>{title}</CardTitle>
        </Link>
        <CardSubtitle>{subtitle}</CardSubtitle>
      </CardHeader>
      <CardBody>
        <BenefitsList>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>
              <FontAwesomeIcon icon={faCheck} /> {benefit}
            </BenefitItem>
          ))}
        </BenefitsList>
      </CardBody>
      <CardFooter>
        <Rating>
          {ratings} <FontAwesomeIcon icon={faStar} />
        </Rating>
        <Price>₹ {price}</Price>
        <BookButton onClick={onBookNowClick}>Book now</BookButton>
      </CardFooter>
    </Card>
  );
};

HotelViewCard.propTypes = {
  hotelCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  benefits: PropTypes.array.isRequired,
  ratings: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  onBookNowClick: PropTypes.func.isRequired,
};

export default HotelViewCard;