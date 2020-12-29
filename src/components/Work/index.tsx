import React, { useState, MouseEvent } from 'react'
import ListItem, { ItemType } from './ListItem'

const Work: React.FC = () => {

  const [value, setValue] = useState<string>('')
  const [list, setList] = useState<ItemType[]>([])

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.target.value)
  }

  const handleClick = (index: number) => {
    list.splice(index, 1)
    setList([...list])
  }

  const handleAddClick = () => {
    if (value) {
      setList([...list, ...[{ value }]])
      setValue('')
    }
  }

  return (
    <>
      <input type="text" value={value} onInput={handleChange} />
      <button onClick={handleAddClick}>添加</button>
      {list.map((item, index) => {
        return <ListItem onClick={() => handleClick(index)} info={item} key={index} />
      })}
    </>
  )
}

export default Work