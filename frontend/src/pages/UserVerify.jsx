import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CommonGetUrl } from '../utils/api';

const UserVerify = () => {


  const params = useParams();

  const [errMsg, setErrMsg] = useState({})

  console.log(errMsg);

  useEffect(() => {

    getUserStatus();
  }, [params])


  const { userId, token } = params;


  const getUserStatus = async () => {
    try {
      const response = await CommonGetUrl(`users/verify/${userId}/${token}`)
      if (response.status === 200) {
        setErrMsg({ status: 200, message: response.data.message });
      }
      // else if()
    } catch (error) {
      setErrMsg({ status: 500, message: error.response.data });
    }
  }

  return (
    <div className='bg-bgColor w-full h-screen text-white flex items-center justify-center gap-3'>
      {errMsg.status === 200 ? (
        <div className=' flex items-center justify-center flex-col gap-3'>
          <p>{errMsg.message}</p>
          <Link to={'/login'} className='px-12 py-3 bg-blue text-white rounded-xl'>Login User</Link>
        </div>
      ) : (
        <div className=' flex items-center justify-center flex-col gap-3'>
          <p>{errMsg.message}</p>
          <Link to={'/register'} className='px-12 py-3 bg-blue rounded-xl'>Register User</Link>
        </div>
      )}
    </div>
  )
}

export default UserVerify