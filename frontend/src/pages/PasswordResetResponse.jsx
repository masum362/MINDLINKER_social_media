import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CommonGetUrl, CommonPostUrl } from '../utils/api';
import { TextInput, CustomBtn, Loading } from '../components/index';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';


const PasswordResetResponse = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: "onChange" });
  const params = useParams();
  const [errMsg, setErrMsg] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector(state => state.user)

  console.log(user)

  useEffect(() => {
    getUserStatus();
  }, [params])


  const { userId, token } = params;
  const navigate = useNavigate()

  const getUserStatus = async () => {
    try {
      const response = await CommonGetUrl(`users/reset-password/${userId}/${token}`)
      if (response.status === 200) {
        setErrMsg({ status: 200, message: 'Please enter the new password' });
      }
      // else if()
    } catch (error) {
      setErrMsg({ status: 500, message: error.response.data });
    }
  }

  const registerSubmit = async (data) => {
    setIsSubmitting(true)
    data.userId = userId
    console.log(data)

    try {
      const response = await CommonPostUrl('users/reset-password', data)
      if (response.status === 200) {
        setErrMsg({ status: 200, message: response.data.message });
      }
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/login')
      }, 2000);
    } catch (error) {
      console.log(error)
      setErrMsg({ status: 500, message: error.response.data });
      setIsSubmitting(false);

    }
  }




  return (
    <div className='bg-bgColor w-full h-screen text-white flex items-center justify-center gap-3'>
      {errMsg.status === 200 ? (
        <div className=' flex items-center justify-center flex-col gap-3'>
          {
            errMsg.message && <span className={`text-sm ${errMsg?.status != "200" ? "text-[#f64949fe]" : 'text-[#2ba150fe]'} mt-0.5`}>
              {errMsg.message}
            </span>
          }
          <form className='py-8 mt-2 text-ascent-2 flex flex-col gap-5' onSubmit={handleSubmit(registerSubmit)}>
            <TextInput
              name={"password"}
              placeholder={'**********'}
              label={"New Password"}
              type={"password"}
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters"
                },

              })}
              styles={"w-full"}
              error={errors.password ? errors.password.message : ""}
            />
            <TextInput
              name={"confirmPassword"}
              placeholder={'**********'}
              label={"Confirm Password"}
              type={"password"}
              register={register("cpassword", {
                validate: (value) => {
                  const { password } = getValues();
                  if (password != value) {
                    return "Password not matched";
                  }
                },
              })}
              styles={"w-full"}
              error={errors.cpassword && errors.cpassword.type === "validate" ? errors.cpassword.message : " "}
            />
            {
              isSubmitting ? <Loading /> : <CustomBtn type={'submit'} containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`} title={'Update'} />
            }
          </form>
        </div>
      ) : (
        <div className=' flex items-center justify-center flex-col gap-3'>
          <p>{errMsg.message}</p>
          <Link to={'/login'} className='px-12 py-3 bg-blue rounded-xl'>Login User</Link>
        </div>
      )}
    </div>
  )
}

export default PasswordResetResponse