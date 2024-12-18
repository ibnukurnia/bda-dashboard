interface EmptyIconProps {
  className?: string
  color?: string
}

const EmptyIcon = ({ className, color = "white" }: EmptyIconProps) => {

  return (
    <svg className={className} width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_901_1578)">
        <path d="M42.8352 22.0931L35.7348 6.70804C34.8587 4.81067 32.9434 3.58337 30.8525 3.58337H12.1475C10.0566 3.58337 8.14133 4.81067 7.267 6.70625L0.164833 22.0931C0.0555417 22.3278 0 22.584 0 22.8438V34.0417C0 37.0051 2.41158 39.4167 5.375 39.4167H37.625C40.5884 39.4167 43 37.0051 43 34.0417V22.8438C43 22.584 42.9445 22.3278 42.8352 22.0931ZM10.5207 8.20767C10.8127 7.57521 11.4505 7.16671 12.1475 7.16671H30.8525C31.5495 7.16671 32.1873 7.57521 32.4793 8.20767L38.614 21.5H34.925C33.531 21.5 32.3235 22.3977 31.9221 23.7342L29.9997 30.1395C29.9441 30.3294 29.7721 30.4584 29.5733 30.4584H13.4267C13.2279 30.4584 13.0559 30.3294 12.9985 30.1377L11.0761 23.7342C10.6748 22.3977 9.46896 21.5 8.07325 21.5H4.386L10.5207 8.20767Z" fill={color} fillOpacity="0.5" />
      </g>
      <defs>
        <clipPath id="clip0_901_1578">
          <rect width="43" height="43" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default EmptyIcon
