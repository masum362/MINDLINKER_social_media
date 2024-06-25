import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TopBar, ProfileCard, FriendsCard, CustomBtn, TextInput, Loading, PostCard, EditProfile } from '../components/index';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets/index';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { CommonDeleteUrl, CommonFileUpload, CommonGetUrl, CommonPostUrl } from '../utils/api';
import { getPosts } from '../redux/postSlice';
import { loginUser } from '../redux/userSlice';

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([])
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({
    defaultValues:
    {
      description: "",
      image: ""
    },
  });

  console.log(posts);
  console.log(user, edit)

  useEffect(() => {
    getAllPosts();
    setLoading(true);
    getFriendRequest();
    getSuggestedFriend();
    getUser();
  }, [user])





  const getUser = async () => {
    if (!user) {
      try {
        const response = await CommonGetUrl(`users/get-user/${user._id}`)
        if (response.data.success === true) {
          dispatch(loginUser({ token: user?.token, ...response.data.user }))
          getFriendRequest();
          getSuggestedFriend();
        }
      } catch (error) {

      }
    }
  }

  const handlePost = async (data) => {
    setPosting(true);
    data.image = file
    try {
      const result = await CommonPostUrl('posts/create-post', data)
      setErrMsg(result.data);
      reset({
        description: "",
        image: ""
      });
      await getAllPosts();
      setPosting(false);
    } catch (error) {
      setErrMsg(error);
      setPosting(false);

    }
  }

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setPosting(true);
    try {
      const result = await CommonFileUpload(formData)
      setFile(result);
      setPosting(false);
    } catch (error) {
      setErrMsg(error)
    }
  }


  const getAllPosts = async () => {
    setLoading(true);
    try {
      const result = await CommonPostUrl('posts/',)
      dispatch(getPosts(result.data.data));
      setLoading(false);
    } catch (error) {
      setErrMsg(error)
      setLoading(false);
    }
  }


  const likePost = async (uri) => {
    try {
      const response = await CommonPostUrl(uri)
      getAllPosts();
    } catch (error) {
      setErrMsg(error)
    }
  }

  const deletePost = async (postid) => {
    try {
      const response = await CommonDeleteUrl(`posts/delete/post/${postid}`)
      getAllPosts();
      setErrMsg(response.data);
    } catch (error) {
      setErrMsg(error)
    }
  }


  const getFriendRequest = async () => {
    try {
      const response = await CommonGetUrl('users/get-friend-request')
      setFriendRequest(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getSuggestedFriend = async () => {
    try {
      const response = await CommonGetUrl('users/suggest-friends')
      setSuggestedFriends(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFriendReq = async (requestTo) => {
    try {
      const response = await CommonPostUrl('users/friend-request', { requestTo })
      getSuggestedFriend();
    } catch (error) {
      console.log(error);
    }
  }


  const acceptFriend = async (id, status) => {
    const obj = { rid: id, status }
    try {
      const response = await CommonPostUrl('users/accept-request', obj)
      if (response.data.success === true) {
        getUser();
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className=' w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* left */}
          <div className=' hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>
          {/* center */}
          <div className=' flex-1 h-full  px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <form className=' bg-primary px-4 rounded-lg ' onSubmit={handleSubmit(handlePost)}>
              <div className='  w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img src={user?.profileUrl ?? NoProfile} alt={user?.firstName} className=' w-10 h-10 object-cover rounded-full' />
                <TextInput
                  styles={"w-full rounded-full py-5 "}
                  placeholder={"What's on your mind..."}
                  name={'description'}
                  register={register('description', {
                    required: "Write something about yourself"
                  })}
                  error={errors?.description ? errors?.description?.message : ""}
                />
              </div>
              {
                errMsg.message && <span className={`text-sm ${errMsg?.status == "failed" ? "text-[#f64949fe]" : 'text-[#2ba150fe]'} mt-0.5`}>
                  {errMsg.message}
                </span>
              }
              <div className=' flex items-center justify-between py-4'>
                <label htmlFor="imgUpload" className=' flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                  <input type="file" onChange={(e) => handleImageUpload(e)} className='hidden' id='imgUpload' data-mx-size={'5120'} accept='.jpg , .png , .jpeg' />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label htmlFor="videoUpload" className=' flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className='hidden' id='videoUpload' data-mx-size={'5120'} accept='.mp4 , .wav' />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>
                <label htmlFor="vgifUpload" className=' flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className='hidden' id='vgifUpload' data-mx-size={'5120'} accept='.gif' />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>


                <div>
                  {posting ? <Loading /> : <CustomBtn
                    type={'submit'}
                    title={'Post'}
                    containerStyles={'bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'}
                  />}

                </div>
              </div>


            </form>
            {
              loading ? <Loading /> : posts.length > 0 ? (
                posts?.map(post => {
                  return (
                    <PostCard key={posts?._id} post={post} user={user} deletePost={deletePost} likePost={likePost} />
                  )
                })
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-lg text-ascent-2">No Post Available</p>
                </div>
              )
            }

          </div>
          {/* right */}
          <div className=' hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* Friend Request */}
            <div className=' w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className=' flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span>Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className=' w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: user }) => {

                  return (
                    <div key={_id} className=' flex items-center justify-between '>
                      <Link to={'/profile/' + user?._id} className=' w-full flex gap-4 items-center cursor-pointer'>
                        <img src={user?.profileUrl ?? NoProfile} alt={user?.firstName} className=' w-10 h-10 object-cover rounded-full' />
                        <div className=' flex-1'>
                          <p className=' text-base font-medium text-ascent-1'>{user?.firstName} {user?.lastName}</p>
                          <span className=' text-sm text-ascent-2'>{user?.profession ?? "No Profession"}</span>


                        </div>

                      </Link>
                      <div className=' flex gap-1 '>
                        <CustomBtn
                          title={"Accept"}
                          onClick={() => acceptFriend(_id, 'accepted')}
                          containerStyles={'bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'}

                        />
                        <CustomBtn
                          title={"Delete"}
                          onClick={() => acceptFriend(_id, 'denied')}
                          containerStyles={'border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'}

                        />
                      </div>
                    </div>
                  )
                })}
              </div>


            </div>
            {/* suggested friend */}
            <div className=' w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className=' flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className=' w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.map((friend) => {
                  return (
                    <div className=' flex items-center justify-between ' key={friend?._id}>
                      <Link to={'/profile/' + friend?._id} className=' w-full flex items-center cursor-pointer gap-4'>
                        <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className=' w-10 h-10 object-cover rounded-full' />
                        <div className=' flex-1 '>
                          <p className=' text-base font-medium text-ascent-1'>{friend?.firstName} {friend?.lastName}</p>
                          <span className=' text-sm text-ascent-2'>{friend?.profession ?? "No Profession"}</span>

                        </div>
                      </Link>
                      <div className=' flex gap-1'>
                        <button className=' bg-[#0444a430] text-sm text-white p-1 rounded' onClick={() => handleFriendReq(friend?._id)}>
                          <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  )
}

export default Home