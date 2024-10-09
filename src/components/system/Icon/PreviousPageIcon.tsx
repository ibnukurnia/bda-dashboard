interface PreviousPageIconProps {
  className?: string | undefined
  color?: string
  strokeOpacity?: string | number
}

const PreviousPageIcon = ({ className, color = "white", strokeOpacity = 0.4 }: PreviousPageIconProps) => {

  return (
    <svg className={className} width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15.3004L0.83887 8.5L10 1.69963L10 15.3004Z" stroke={color} stroke-opacity={strokeOpacity} />
    </svg>
  )
}

export default PreviousPageIcon
