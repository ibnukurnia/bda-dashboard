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
      className={`${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-primary-blue'} hover:bg-blue-800 hover:text-white disabled:text-gray-400 disabled:bg-gray-200 px-4 py-2 rounded-lg flex-1 text-center`}
    >
      {children}
    </button>
  )
}

export default Button
