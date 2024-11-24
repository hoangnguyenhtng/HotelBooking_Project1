import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const Input = (props) => {
  const {
    classes,
    value,
    onChangeInput,
    icon,
    type,
    placeholder,
    min = 0,
    max,
  } = props;
  const [isTypeheadVisible, setIsTypeheadVisible] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (type === 'number') {
      // Chỉ cho phép số không âm
      const numValue = Math.max(0, parseInt(newValue) || 0);
      // Áp dụng giới hạn tối đa nếu được cung cấp
      const limitedValue = max !== undefined ? Math.min(numValue, max) : numValue;
      onChangeInput(limitedValue.toString());
    } else {
      onChangeInput(newValue);
    }
  };

  const onBlur = () => {
    // Delay hiding the typehead results to allow time for click event on result
    setTimeout(() => {
      setIsTypeheadVisible(false);
    }, 200);
  };

  return (
    <div className={`relative stay-booker-input__container md:w-auto`}>
      <input
        className={`stay-booker__input ps-8 pe-0 py-2 capitalize ${classes ? classes : ''
          }`}
        type={type || 'text'}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        onBlur={onBlur}
        onFocus={() => setIsTypeheadVisible(true)}
        min={min}
        max={max}
      />
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="absolute transform-center-y left-4"
          color="#074498"
        />
      )}
      <div
        className={`z-10 absolute bg-white w-full ${isTypeheadVisible ? 'visible' : 'hidden'
          }`}
      >
        {/* Typehead content can be added here if needed */}
      </div>
    </div>
  );
};

export default Input;