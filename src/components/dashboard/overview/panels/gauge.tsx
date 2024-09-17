import './gauge.css'

interface GaugeProps {
  value: number
  divider?: number
  label: string
}

const Gauge = ({ value, divider = 100, label }: GaugeProps) => {
  return (
    <div className="flex flex-col flex-grow px-6 py-8 border border-gray-800 rounded-lg gap-4 w-max justify-center items-center">
      <div className="gauge">
        <div className="slice-colors">
          <div className="st slice-item"></div>
          <div className="st slice-item"></div>
          <div className="st slice-item"></div>
          <div className="st slice-item"></div>
        </div>
        <div className="needle" style={{ transform: `rotate(${Math.round((value / divider) * 180)}deg)` }} />
        <div className="gauge-center">
          {Number.isInteger(value) ? value : value.toFixed(4).slice(0, value.toFixed(4).length - 2)}
        </div>
      </div>
      <span className="text-white text-center">{label}</span>
    </div>
  )
}

export default Gauge
