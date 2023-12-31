import React from 'react'

const TextInput = ({type,placeholder , styles , label , labelStyles,register , name, error,value},ref) => {
  return (
    <div className='w-full flex flex-col mt-2 '>
      {
        label && <label htmlFor={name} className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</label>
      }
      <div>
        <input type={type} name={name} placeholder={placeholder} ref={ref} className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`} 
         {...register}
         aria-invalid={error ? "true" : "false"}
         value={value}
        />
       
      </div>
      {error && (
        <span className='text-xs text-[#f64949fe] mt-0.5'>{error}</span>
      )}
    </div>
  )
}

export default React.forwardRef(TextInput)