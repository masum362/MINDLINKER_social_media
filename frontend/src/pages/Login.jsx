import React, { useRef, useState } from 'react'
import { SiConvertio } from "react-icons/si";
import { TextInput, Loading, CustomBtn } from '../components/index';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BgImage } from '../assets/index'
import { BsShare } from 'react-icons/bs'
import { ImConnection } from 'react-icons/im'
import { AiOutlineInteraction } from 'react-icons/ai'
import { CommonPostUrl } from '../utils/api';
import { loginUser } from '../redux/userSlice';




const Login = () => {
  const inputRef = useRef()
  const dispatch = useDispatch()
  const [errMsg, setErrMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await CommonPostUrl('auth/login', data)
      console.log(result.data);
      setErrMsg({ success: 'success', message: "User login successfully" });
      const newResponse = { token: result.data?.token, ...result.data?.user }
      console.log({ newResponse })
      dispatch(loginUser(newResponse))
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/')
      }, 2000);
    } catch (error) {
      console.log(error.response);
      setErrMsg({ status: 'failed', message: error.response.data.message })
      setIsSubmitting(false);

    }
  };


  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className=' w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center jusce mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <SiConvertio />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold' >MindLinker</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>Log in Your Account</p>
          <span className='text-sm text-ascent-2 mt-2'>Welcome Back</span>
          <form className='py-8 mt-2 text-ascent-2 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name={"email"}
              placeholder={'example@example.com'}
              label={"Email Address"}
              type={"email"}
              register={register("email", {
                required: "Email Address is required",
              })}
              styles={"w-full rounded-full"}
              labelStyles={'ml-2'}
              error={errors.email ? errors.email.message : ""}
            />
            <TextInput
              name={"password"}
              placeholder={'**********'}
              label={"Password"}
              type={"password"}
              register={register("password", {
                required: "Password is required",
              })}
              styles={"w-full rounded-full"}
              labelStyles={'ml-2'}
              error={errors.password ? errors.password.message : ""}
            />
            <Link to='/reset-password' className=' text-sm text-right text-blue font-semibold'>Forget Password ?</Link>

            {
              errMsg.message && <span className={`text-sm ${errMsg?.status == "failed" ? "text-[#f64949fe]" : 'text-[#2ba150fe]'} mt-0.5`}>
                {errMsg.message}
              </span>
            }
            {
              isSubmitting ? <Loading /> : <CustomBtn type={'submit'} containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`} title={'login'} />
            }
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Don't have an account?
            <Link to={'/register'} className='text-[#065ad8] font-semibold ml-2 cursor-pointer'>Create Account</Link>
          </p>
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
          <div className=' relative w-full flex items-center justify-center'>
            <img src={BgImage} alt="background-image" className=' w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover' />
            <div className='absolute flex items-center gap-1 bg-white right-8 top-10  py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>
            <div className='absolute flex items-center gap-1 bg-white left-6 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-6 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>
          <div className='mt-16 text-center'>
            <p className='text-white text-base'>Connect with friends & have share for fun</p>
            <span className='text-sm text-white'>Share memories with friends and the world.</span>

          </div>


        </div>
      </div>
    </div>
  )
}

export default Login