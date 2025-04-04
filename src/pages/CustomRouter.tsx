import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { APP_BASE_PATH } from 'app';
import PublicLogin from './PublicLogin';
import PublicSignUp from './PublicSignUp';

export const CustomRouter = () => {
  return (
    <Router basename={APP_BASE_PATH}>
      <Routes>
        <Route path="/public-login" element={<PublicLogin />} />
        <Route path="/public-signup" element={<PublicSignUp />} />
      </Routes>
    </Router>
  );
};
