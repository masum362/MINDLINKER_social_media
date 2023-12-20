import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BsSunFill, BsMoon } from 'react-icons/bs'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import { TextInput, CustomBtn } from './index'
import { setTheme } from '../redux/themeSlice'
import { logout } from '../redux/userSlice'
import { SiConvertio } from "react-icons/si";





const TopBar = () => {
    const { theme } = useSelector(state => state.theme);
    const { user:{user} } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    const handleTheme = () => {
        const themeValue = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(themeValue));
    }


    return (
        <div className=' topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
            <Link to={'/'} className=' flex gap-2 items-center '>
                <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
                    <SiConvertio />
                </div>
                <span className=' text-xl md:text-2xl text-[#065ad8] font-semibold '>MindLinker</span>
            </Link>
            <form className=' hidden md:flex items-center justify-center' onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    placeholder={"Search..."}
                    styles='w-[18rem] lg:w-[38rem] rounded-l-full py-3'
                    register={register('search')}
                />
                <CustomBtn
                    title={'Search'}
                    type={'submit'}
                    containerStyles={'bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'}
                />
            </form>
            {/* icons */}
            <div className='flex gap-4 items-center text-ascent-1 text-base md:text-xl'>

                <button onClick={() => handleTheme()}>{theme == 'light' ? <BsMoon /> : <BsSunFill />}</button>
                <div className='hidded lg:flex'>
                    <IoMdNotificationsOutline />
                </div>

                <div>
                    <CustomBtn
                        onClick={() => dispatch(logout())}
                        title={'logout'}
                        containerStyles={'text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'}
                    />
                </div>
            </div>
        </div>
    )
}

export default TopBar