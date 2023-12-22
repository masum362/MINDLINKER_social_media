import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomBtn, Loading, TextInput } from '../components/index';
import { CommonPostUrl } from '../utils/api';

const ResetPassword = () => {




  const [errMsg, setErrMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const response = await CommonPostUrl('users/request-passwordreset',data)

      console.log(response)
    } catch (error) {
      console.log(error);
    }

  }



  return (
    <div className=' w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>

      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>

        <p className='text-ascent-1 text-lg font-semibold'>Email Address</p>
        <span className='text-sm text-ascent-2'>Enter email address used during registration</span>
        <form onSubmit={handleSubmit(onSubmit)} className=' py-4 flex flex-col gap-5'>
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
          {
            errMsg.message && <span role='alert' className={`text-sm ${errMsg?.status == "failed" ? "text-[#f64949fe]" : 'text-[#2ba150fe]'} mt-0.5`}>
              {errMsg.message}
            </span>
          }

          {
            isSubmitting ? <Loading /> : <CustomBtn type={'submit'} containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`} title={'Verify'} />
          }
        </form>
      </div>
    </div>
  )
}

export default ResetPassword