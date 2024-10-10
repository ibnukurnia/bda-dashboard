interface MenuForecastingIconProps {
  className?: string
  color?: string
  opacity?: string | number
}

const MenuForecastingIcon = ({ className, color = "white", opacity = 1 }: MenuForecastingIconProps) => {

  return (
    <svg className={className} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31.3333 27.804L27.4468 25.0285C27.3571 24.9659 27.2536 24.9205 27.1356 24.9205C26.8294 24.9205 26.5818 25.168 26.5818 25.4743V27.1356H6.09168V6.64547H7.75304C8.05929 6.64547 8.30683 6.39792 8.30683 6.09168C8.30683 5.97372 8.26142 5.87016 8.19884 5.7799L5.42326 1.89397C5.32191 1.75663 5.16741 1.66138 4.9841 1.66138C4.8008 1.66138 4.64629 1.75663 4.54495 1.89397L1.76937 5.78045C1.70679 5.87016 1.66138 5.97372 1.66138 6.09168C1.66138 6.39792 1.90892 6.64547 2.21516 6.64547H3.87653V28.2432C3.87653 28.8546 4.37272 29.3508 4.9841 29.3508H26.5818V31.0121C26.5818 31.3184 26.8294 31.5659 27.1356 31.5659C27.2536 31.5659 27.3571 31.5205 27.4474 31.4579L31.3339 28.6823C31.4707 28.581 31.5659 28.4265 31.5659 28.2432C31.5659 28.0599 31.4707 27.9054 31.3333 27.804Z" fill={color} fillOpacity={opacity} />
      <path d="M31.0121 18.8288H28.9277L23.1378 7.25855C22.9551 6.89637 22.584 6.64551 22.1515 6.64551C21.7068 6.64551 21.3264 6.90966 21.1497 7.28679L14.815 20.9238L11.4601 15.4768C11.2646 15.1633 10.9191 14.9523 10.522 14.9523H7.75305V17.1675H9.90286L14.0125 23.8384C14.2069 24.1541 14.5536 24.3667 14.9523 24.3667C15.397 24.3667 15.7774 24.1031 15.9541 23.7254L22.1886 10.3038L27.2602 20.4365C27.443 20.7953 27.8124 21.044 28.2432 21.044H31.0121V18.8288Z" fill={color} fillOpacity={opacity} />
    </svg>
  )
}

export default MenuForecastingIcon
