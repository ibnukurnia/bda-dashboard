import { keyframes, Skeleton as MUISkeleton, SxProps, Theme } from "@mui/material";

const waveAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;


interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
  height?: number | string
  width?: number | string
  customStyle?: SxProps<Theme>
}

const Skeleton = ({ className, variant = 'rounded', height = '100%', width = '100%', customStyle }: SkeletonProps) => {
  return (
    <MUISkeleton
      className={className}
      animation="wave"
      sx={{
        bgcolor: 'grey.800',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))',    backgroundSize: '200px 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        animation: `${waveAnimation} 1.6s ease-in-out infinite`,
        ...customStyle
      }}
      variant={variant}
      width={width}
      height={height}
    />
  )
}

export default Skeleton
