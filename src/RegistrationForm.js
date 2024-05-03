import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
      resolver: yupResolver(schema),
    });
  
    const [createUser, { loading, error, data }] = useMutation(CREATE_USER);
  
    const onSubmit = async (formData) => {
      try {
        const { name, email, password } = formData;
        await createUser({ variables: { name, email, password } }); // Передача переменных в мутацию
        reset();
      } catch (error) {
        console.error('Registration error:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="input-container">
          <input type="text" placeholder="Name" {...register('name')} className="input-field" />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
  
        <div className="input-container">
          <input type="text" placeholder="Email" {...register('email')} className="input-field" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
  
        <div className="input-container">
          <input type="password" placeholder="Password" {...register('password')} className="input-field" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
  
        <div className="input-container">
          <input type="password" placeholder="Confirm Password" {...register('confirmPassword')} className="input-field" />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
  
        <button type="submit" disabled={loading} className="submit-button">Register</button>
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error.message}</p>}
        {data && <p className="success-message">Registration successful!</p>}
      </form>
    );
  };
  

export default RegistrationForm;
