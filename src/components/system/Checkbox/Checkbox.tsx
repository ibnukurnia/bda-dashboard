import { DataCheckbox } from './types'

interface CheckboxProps {
  data: DataCheckbox[]
  selectedData?: DataCheckbox[]
  onChange?: (value?: any) => void
  color?: 'white' | 'black'
}

const Checkbox = ({ data, onChange, selectedData, color = 'black' }: CheckboxProps) => {
  const handleChange = (value: DataCheckbox) => {
    onChange && onChange(value)
  }

  return data.map((item, id) => (
    <label key={id} className="flex items-center justify-between mb-2">
      <div className={`flex items-center cursor-pointer text-${color}`}>
        <input
          type="checkbox"
          value={item.id}
          checked={selectedData?.some((selected) => selected.id === item.id)}
          onChange={() => handleChange(item)}
          className="mr-2 cursor-pointer"
        />
        {item.label ?? item.value}
      </div>
    </label>
  ))
}

export default Checkbox
