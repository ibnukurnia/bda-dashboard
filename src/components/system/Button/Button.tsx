interface ButtonProps {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Button = ({ children, disabled = false, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${variant === 'primary' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-primary-blue'} flex gap-2 justify-center items-center hover:bg-blue-800 hover:text-white disabled:text-gray-400 disabled:bg-gray-200 px-4 py-3 rounded flex-1 text-center`}
    >
      {children}
    </button>
  )
}

export default Button
