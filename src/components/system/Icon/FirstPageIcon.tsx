interface FirstPageIconProps {
  className?: string | undefined
  color?: string
  strokeOpacity?: string | number
}

const FirstPageIcon = ({ className, color = "white", strokeOpacity = 0.4 }: FirstPageIconProps) => {

  return (
    <svg className={className} width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 16.3004L0.83887 9.5L10 2.69963L10 16.3004Z" stroke={color} stroke-opacity={strokeOpacity} />
      <line x1="0.5" y1="1" x2="0.499999" y2="18" stroke={color} stroke-opacity={strokeOpacity} />
    </svg>
  )
}

export default FirstPageIcon
