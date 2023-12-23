import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { EditProfile, FriendsCard, Loading, PostCard, ProfileCard, TopBar } from '../components/index';
import { CommonDeleteUrl, CommonGetUrl, CommonPostUrl } from '../utils/api';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: { user }, edit } = useSelector(state => state.user)
  const [userInfo, setUserInfo] = useState(user);
  // const allpost = useSelector(state => state.post.posts);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false);

  const params = useParams();

  console.log(params.id)

  useEffect(() => {
    setLoading(true);
    getProfileUser();
    getPostUser();
    getProfileViews();
  }, [params.id])

  const getProfileUser = async () => {
    try {
      const response = await CommonGetUrl(`users/get-user/${params.id}`)
      setUserInfo(response.data.user)
    } catch (error) {

    }
  }

  const getPostUser = async () => {
    try {
      const response = await CommonGetUrl(`posts/get-user-post/${params.id}`)
      setPosts(response.data.data)
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  const getProfileViews = async () => {
    const { id } = params
    try {
      const response = await CommonPostUrl('users/profile-view', { id })
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  console.log({ posts })
  // console.log({ user })

  const handleDelete = async (id) => {
    try {
      const response = await CommonDeleteUrl(`posts/delete/post/${id}`)
      await getPostUser();
    } catch (error) {
      console.log(error)
    }
  };

  const handleLikePost = async (userId, postId) => {
    try {
      const response = await CommonPostUrl(`posts/like/${postId}`)
      await getPostUser();
    } catch (error) {

    }


  };


  return (
    <>
      <div className=' home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />
        <div className=' w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* left */}
          <div className=' hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={userInfo} />
            <div className=' block lg:hidden'>
              <FriendsCard friends={userInfo?.friends} />

            </div>
          </div>
          {/* center */}
          <div className=' flex-1 h-full bg-primary px-4 flex flex-col overflow-y-auto'>
            {loading ? (
              <Loading />) : posts?.length > 0 ? (
                posts?.map((post) => (
                  <PostCard
                    post={post}
                    key={post?._id}
                    user={userInfo}
                    deletePost={(handleDelete)}
                    likePost={handleLikePost}
                  />
                ))
              ) : (
              <div className=' flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )
            }
          </div>

          {/* right */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard friends={userInfo?.friends} />
          </div>

        </div>
      </div>
      {edit && <EditProfile />}
    </>
  )
}

export default Profile