import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import PrivateRoute from './components/PrivateRoute';
import MemberManage from './pages/manage/member'
import PageNotFound from './pages/404';
import HomePage from './pages/home';
import PTManage from './pages/manage/pt';
import ExercisePage from './pages/manage/exercise';
import PackageManage from './pages/manage/package';
import NEManage from './pages/manage/ne';
import CalendarPage from './pages/calendar';

function App() {
  const [ authenticate, setAuthenticate ] = useState(
    localStorage.getItem('loginData') ? true : false
  );

  const handleLogin = (data) => {
    setAuthenticate(data);
  }

  const isAuthenticated = () => {
    return authenticate;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} />
        <Route exact path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} setAuthenticated={handleLogin}/>}>
          <Route index element={<HomePage />} />
          <Route path="/management">
            <Route exact path="member" element={<MemberManage />} />
            <Route exact path="pt" element={<PTManage />} />
            <Route exact path="ne" element={<NEManage />} />
            <Route exact path="exercise" element={<ExercisePage />} />
            <Route exact path="package" element={<PackageManage />} />
          </Route>
          <Route exact path="calendar" element={<CalendarPage />} />
        </Route>
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;
