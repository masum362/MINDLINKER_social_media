import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { CustomBtn, Loading, TextInput } from './index'
import { dispatch } from '../redux/store';
import { updateUser } from '../redux/userSlice';


const EditProfile = () => {
  const { user } = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errMsg, setErrMsg] = useState('null');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => { }

  const handleClose = () => {
    dispatch(updateUser(false));
   }

  const handleSelect = (e) => {
    setFile(e.target.files[0])
   }



  return (

    < >
      <div className='fixed z-50 inset-0 overflow-y-auto '>
        <div className=' flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <div className=' fixed inset-0  transition-opacity'>
            <div className=' absolute inset-0 bg-[#000] opacity-70'>

            </div>
            <span className=' hidden sm:inline-block sm:align-middle sm:h-screen'>

            </span>
            &#8203;

            <div className=' inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
              role='dialog'
              aria-modal="true"
              aria-labelledby='modal-headline'>
              <div className=' flex justify-between px-6 pt-5 pb-2'>
                <label htmlFor="name"
                  className='block font-medium text-xl text-ascent-1 text-left'>
                  Edit Profile
                </label>
                <button
                  type="button"
                  class="text-ascent-1"
                  onClick={handleClose}
                >
                  <MdClose size={22} />
                </button>

              </div>
              <form
                className=' px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
                onSubmit={handleSubmit(onsubmit)}
              >

                <TextInput
                  label={'First Name'}
                  placeholder={"Masum"}
                  type={"text"}
                  styles={"w-full"}
                  register={register("firstName", {
                    required: "First name required",
                  })}
                  error={errors?.firstName ? errors.firstName?.message : ""}

                />
                <TextInput
                  label={'Last Name'}
                  placeholder={"Ahmed"}
                  type={"text"}
                  styles={"w-full"}
                  register={register("lastName", {
                    required: "Last name required",
                  })}
                  error={errors?.lastName ? errors.lastName?.message : ""}

                />
                <TextInput
                  label={'Profession'}
                  placeholder={"profession"}
                  type={"text"}
                  styles={"w-full"}
                  register={register("profession", {
                    required: "profession required",
                  })}
                  error={errors?.profession ? errors.profession?.message : ""}

                />
                <TextInput
                  label={'Location'}
                  placeholder={"location"}
                  type={"text"}
                  styles={"w-full"}
                  register={register("location", {
                    required: "location do no match",
                  })}
                  error={errors?.location ? errors.location?.message : ""}

                />

                <label htmlFor="imgUpload" className=' flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'>
                  <input type="file" onChange={(e) => handleSelect(e)} className='' id='imgUpload' accept='.jpg , .png , .jpeg' />
                  {/* <BiImages />
                  <span>Image</span> */}
                </label>
                {errMsg?.message && (
                  <span
                    role='alert'
                    className={`text-sm ${errMsg?.status === "failed" ? "text-[#f64949fe]" : "text-[#2ba150fe]"} mt-0.5`}>
                    {errMsg?.message}
                  </span>
                )}
                <div className=' py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
                {loading ? <Loading /> : <CustomBtn
                  type={'submit'}
                  title={'Submit'}
                  containerStyles={'inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'}
                />}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProfile