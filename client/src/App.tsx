import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskList from './components/tasks/TaskList';
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/tasks" /> : 
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/register" element={
          user ? <Navigate to="/tasks" /> :
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Layout>
              <TaskList />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  );
};

export default App;
