import React from 'react'

const EditProfile = () => {
    const { user } = useSelector((state) => state.user);
  
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errMsg, setErrMsg] = useState('null');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

  return (
    
    <div>EditProfile</div>
  )
}

export default EditProfile