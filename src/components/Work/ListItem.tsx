import React, { MouseEvent } from 'react'

export interface ItemType {
  value: string
}

interface ListItemProps {
  info: ItemType;
  onClick?: (ev: MouseEvent<HTMLDivElement>) => void;
}

const ListItem: React.FC<ListItemProps> = (props) => {
  const { info, onClick } = props
  return (
    <div onClick={onClick}>{info.value}</div>
  )
}

export default ListItem