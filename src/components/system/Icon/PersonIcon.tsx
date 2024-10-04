interface PersonIconProps {
  className: string | undefined
}

const PersonIcon = ({className}: PersonIconProps) => {

  return (
    <svg className={className} width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_204_1206)">
        <path d="M6.33333 6.04167C6.33333 6.88152 6.66696 7.68697 7.26083 8.28084C7.85469 8.8747 8.66015 9.20833 9.5 9.20833C10.3399 9.20833 11.1453 8.8747 11.7392 8.28084C12.333 7.68697 12.6667 6.88152 12.6667 6.04167C12.6667 5.20181 12.333 4.39636 11.7392 3.8025C11.1453 3.20863 10.3399 2.875 9.5 2.875C8.66015 2.875 7.85469 3.20863 7.26083 3.8025C6.66696 4.39636 6.33333 5.20181 6.33333 6.04167Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.75 17.125V15.5417C4.75 14.7018 5.08363 13.8964 5.6775 13.3025C6.27136 12.7086 7.07681 12.375 7.91667 12.375H11.0833C11.9232 12.375 12.7286 12.7086 13.3225 13.3025C13.9164 13.8964 14.25 14.7018 14.25 15.5417V17.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_204_1206">
          <rect width="19" height="19" fill="white" transform="translate(0 0.5)"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default PersonIcon
