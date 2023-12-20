import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { CustomBtn, Loading, TextInput } from './index'
import { dispatch } from '../redux/store';
import { loginUser, updateUser } from '../redux/userSlice';
import { CommonFileUpload, CommonPutUrl } from '../utils/api';


const EditProfile = () => {
  const { user:{user}} = useSelector((state) => state.user);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errMsg, setErrMsg] = useState('null');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  
   useEffect(() => {
    console.log(file)
   }, [file])
   

  const onSubmit = async (data) => {
    data.profileUrl = file;
    console.log(data)

    try {
     const result =  await CommonPutUrl("users/update-user",data);
     dispatch(loginUser(result.data))
     dispatch(updateUser(false))
    } catch (error) {
      console.log(error)
    }
   }

  const handleClose = () => {
    dispatch(updateUser(false));
   }

  const handleSelect =async (e) => {

    const formData = new FormData();
    formData.append('image', e.target.files[0]);

try {
  setLoading(true);
  const result = await CommonFileUpload(formData)
  setFile(result);
setLoading(false)
} catch (error) {
  console.log(error)
}

  //   const Api = "https://api.imgbb.com/1/upload?expiration=63072000&key=7dfd97eb382b65ec8ec1a88ce98dfab1";
  //   await axios.post(Api, formData).then((res) => {
  //     console.log(res)
  //     const url = res.data.data.url;
  //     console.log({ url })
  //     setFile(url);
  //   })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //  }

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
                onSubmit={handleSubmit(onSubmit)}
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