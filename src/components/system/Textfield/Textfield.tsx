import { ChangeEventHandler } from 'react'

interface TextfieldProps {
  value?: string | number | readonly string[]
  onChange?: ChangeEventHandler<HTMLElement>
  placeholder?: string
  disabled?: boolean
}

const Textfield = ({ value, onChange, placeholder, disabled }: TextfieldProps) => {
  return (
    <input
      className="w-full text-black border border-gray-300 bg-light-700 hover:bg-light-800 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 mb-2"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default Textfield
