import * as Yup from 'yup';
const phoneRegExp = /^\d{10}$/;

class ValidationSchema {
  static email = Yup.string().email('Email không hợp lệ').required('Bắt buốc');
}

class Schemas extends ValidationSchema {
  static signupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Quá ngắn!')
      .max(50, 'Quá dài!')
      .required('Bắt buộc'),
    lastName: Yup.string()
      .min(2, 'Quá ngắn!')
      .max(50, 'Quá dài!')
      .required('Bắt buộc'),
    email: ValidationSchema.email,
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
      .required('Bắt buộc'),
    password: Yup.string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .required('Bắt buộc'),
    confirmPassword: Yup.string().required('Bắt buộc').oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
  });
}

export default Schemas;
