interface NextPageIconProps {
  className?: string | undefined
  color?: string
  strokeOpacity?: string | number
}

const NextPageIcon = ({ className, color = "white", strokeOpacity = 0.4 }: NextPageIconProps) => {

  return (
    <svg className={className} width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999999 1.69963L10.1611 8.5L1 15.3004L0.999999 1.69963Z" stroke={color} stroke-opacity={strokeOpacity} />
    </svg>
  )
}

export default NextPageIcon
