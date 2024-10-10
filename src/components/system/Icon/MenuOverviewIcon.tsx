interface MenuOverviewIconProps {
  className?: string
  color?: string
  opacity?: string | number
}

const MenuOverviewIcon = ({ className, color = "white", opacity = 1 }: MenuOverviewIconProps) => {

  return (
    <svg className={className} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_415_68)">
        <path d="M7.08337 13.0334H11.3334V26.9167H7.08337V13.0334ZM15.0167 7.08337H18.9834V26.9167H15.0167V7.08337ZM22.95 18.4167H26.9167V26.9167H22.95V18.4167Z" fill={color} fillOpacity={opacity}/>
      </g>
      <defs>
        <clipPath id="clip0_415_68">
          <rect width="34" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default MenuOverviewIcon
