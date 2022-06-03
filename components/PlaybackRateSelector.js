import React from 'react'
import Select from 'react-select'

const options = [
  { value: 0.25, label: '.25x' },
  { value: 0.50, label: '.5x' },
  { value: 0.75, label: '.75x' },
  { value: 1, label: '1x' }
]

const PlaybackRateSelector = ({ disabled, onChange }) => (
  <Select isDisabled={disabled} options={options} defaultValue={options[3]} onChange={onChange}/>
)

export default PlaybackRateSelector
