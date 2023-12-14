import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home";
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'

export const Layout = () => {
  const {user} = useSelector(state => state.user)
  const location  = useLocation();

  
console.log({user});
  return (
<>
{user?.token ? <Outlet /> : <Navigate to={'/login'} state={{from:location}} replace />}
</>
  )
}





function App() {
  const {theme} = useSelector(state => state.theme)
  
 
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='/profile/:id?' element={<Profile />} />
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
   
    </div>
  )
}

export default App
