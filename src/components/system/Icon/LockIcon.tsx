interface LockIconProps {
  className: string | undefined
}

const LockIcon = ({className}: LockIconProps) => {

  return (
    <svg className={className} width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_204_1226)">
        <path d="M3.95833 10.7917C3.95833 10.3717 4.12515 9.96901 4.42208 9.67208C4.71901 9.37514 5.12174 9.20833 5.54167 9.20833H13.4583C13.8783 9.20833 14.281 9.37514 14.5779 9.67208C14.8749 9.96901 15.0417 10.3717 15.0417 10.7917V15.5417C15.0417 15.9616 14.8749 16.3643 14.5779 16.6612C14.281 16.9582 13.8783 17.125 13.4583 17.125H5.54167C5.12174 17.125 4.71901 16.9582 4.42208 16.6612C4.12515 16.3643 3.95833 15.9616 3.95833 15.5417V10.7917Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.70833 13.1667C8.70833 13.3766 8.79174 13.578 8.94021 13.7265C9.08867 13.8749 9.29004 13.9583 9.5 13.9583C9.70996 13.9583 9.91133 13.8749 10.0598 13.7265C10.2083 13.578 10.2917 13.3766 10.2917 13.1667C10.2917 12.9567 10.2083 12.7553 10.0598 12.6069C9.91133 12.4584 9.70996 12.375 9.5 12.375C9.29004 12.375 9.08867 12.4584 8.94021 12.6069C8.79174 12.7553 8.70833 12.9567 8.70833 13.1667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.33333 9.20833V6.04167C6.33333 5.20181 6.66696 4.39636 7.26083 3.8025C7.85469 3.20863 8.66015 2.875 9.5 2.875C10.3399 2.875 11.1453 3.20863 11.7392 3.8025C12.333 4.39636 12.6667 5.20181 12.6667 6.04167V9.20833" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_204_1226">
          <rect width="19" height="19" fill="white" transform="translate(0 0.5)"/>
        </clipPath>
      </defs>
    </svg>
  )
}

export default LockIcon
