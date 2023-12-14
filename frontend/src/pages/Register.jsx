import React, { useRef, useState } from 'react'
import { SiConvertio } from "react-icons/si";
import { TextInput, Loading, CustomBtn } from '../components/index';
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BgImage } from '../assets/index'
import { BsShare, BsTerminalX } from 'react-icons/bs'
import { ImConnection } from 'react-icons/im'
import { AiOutlineInteraction } from 'react-icons/ai'
const Register = () => {
  const { register, handleSubmit,getValues, formState: { errors } } = useForm({ mode: "onChange" });
  const formshook = useForm();
  const inputRef = useRef()

  const [errMsg, setErrMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch()
  const onSubmit =async(data) => console.log(data);


  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className=' w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center jusce mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <SiConvertio />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold' >MindLinker</span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>Register Your Account</p>
          <form className='py-8 mt-2 text-ascent-2 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            
            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
            <TextInput
            name={'firstName'}
            label={'First Name'}
            placeholder={'First Name'}
            type={'text'}
            styles={'w-full '}
            register={register("firstName",{
              required:"First Name is required",
            })}
            error={errors.firstName ? errors.firstName?.message : ""}
            />
            <TextInput
            name={'lastName'}
            label={'Last Name'}
            placeholder={'Last Name'}
            type={'text'}
            styles={'w-full '}
            register={register("lastName",{
              required:"Last Name is required",
            })}
            error={errors.lastName ? errors.lastName?.message : ""}
            />
            </div>

            <TextInput
              name={"email"}
              placeholder={'example@example.com'}
              label={"Email Address"}
              type={"email"}
              register={register("email", {
                required: "Email Address is required",
              })}
              styles={"w-full "}
              error={errors.email ? errors.email.message : ""}
            />

<div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'> 

            <TextInput
              name={"password"}
              placeholder={'**********'}
              label={"Password"}
              type={"password"}
              register={register("password", {
                required: "Password is required",
                pattern:{
                  value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:"Enter a strong password"

                },
                minLength:{
                  value:8,
                  message:"Must be at least 8 characters"
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
                validate:(value) => {
                  const {password} = getValues();
                  if(password != value){
                    return "Password not matched";
                  }
                },
              })}
              styles={"w-full"}
              error={errors.cpassword && errors.cpassword.type==="validate"  ? errors.cpassword.message :  " " }
            />

</div>

            {
              errMsg.message && <span className={`text-sm ${errMsg?.status == "failed" ? "text-[#f64949fe]" : 'text-[#2ba150fe]'} mt-0.5`}>
                {errMsg.message}
              </span>
            }
            {
              isSubmitting ? <Loading /> : <CustomBtn type={'submit'} containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`} title={'Register'} />
            }
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Already have an account?
            <Link to={'/login'} className='text-[#065ad8] font-semibold ml-2 cursor-pointer'>Login</Link>
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

export default Register