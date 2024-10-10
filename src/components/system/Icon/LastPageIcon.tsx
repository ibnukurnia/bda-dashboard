interface LastPageIconProps {
  className?: string | undefined
  color?: string
  strokeOpacity?: string | number
}

const LastPageIcon = ({ className, color = "white", strokeOpacity = 0.4 }: LastPageIconProps) => {

  return (
    <svg className={className} width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16.3004L13.1611 9.5L4 2.69963L4 16.3004Z" stroke={color} strokeOpacity={strokeOpacity} />
      <line y1="-0.5" x2="17" y2="-0.5" transform="matrix(4.37114e-08 1 1 -4.37114e-08 14 1)" stroke={color} strokeOpacity={strokeOpacity} />
    </svg>
  )
}

export default LastPageIcon
