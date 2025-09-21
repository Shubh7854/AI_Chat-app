import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    return errors;
  };

  const getPasswordValidationStatus = (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please check your password and try again.');
      return;
    }

    dispatch(register({
      username: formData.username,
      password: formData.password,
    }));
  };

  const isPasswordValid = passwordErrors.length === 0 && formData.password.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const showPasswordMismatchWarning = formData.confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card text-card-foreground shadow-lg w-full max-w-md">
          <div className="flex flex-col p-6 space-y-1">
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">Sign Up</h3>
            <p className="text-sm text-muted-foreground text-center">Create an account to get started</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6 pt-0 space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium select-none" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  className="flex h-11 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-inner"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium select-none" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="flex h-11 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-inner pr-10"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-accent-foreground active:scale-[0.98] rounded-lg text-xs absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4" aria-hidden="true">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
                
                {/* Password Validation */}
                {formData.password && (
                  <div className="space-y-1">
                    {(() => {
                      const validation = getPasswordValidationStatus(formData.password);
                      return (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check h-3 w-3 ${validation.minLength ? 'text-green-500' : 'text-gray-400'}`} aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span className={validation.minLength ? 'text-green-500' : 'text-gray-500'}>At least 8 characters</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check h-3 w-3 ${validation.hasUppercase ? 'text-green-500' : 'text-gray-400'}`} aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span className={validation.hasUppercase ? 'text-green-500' : 'text-gray-500'}>One uppercase letter</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check h-3 w-3 ${validation.hasLowercase ? 'text-green-500' : 'text-gray-400'}`} aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span className={validation.hasLowercase ? 'text-green-500' : 'text-gray-500'}>One lowercase letter</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check h-3 w-3 ${validation.hasNumber ? 'text-green-500' : 'text-gray-400'}`} aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span className={validation.hasNumber ? 'text-green-500' : 'text-gray-500'}>One number</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium select-none" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="flex h-11 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 shadow-inner pr-10"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-accent-foreground active:scale-[0.98] rounded-lg text-xs absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-4 w-4" aria-hidden="true">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
                
                {/* Password Mismatch Warning */}
                {showPasswordMismatchWarning && (
                  <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle h-3 w-3" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4"></path>
                      <path d="M12 16h.01"></path>
                    </svg>
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="items-center p-6 pt-0 flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-blue/20 hover:bg-primary/90 active:scale-[0.98] h-10 px-6 py-2 w-full"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-primary underline-offset-4 hover:underline p-0 h-auto">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

