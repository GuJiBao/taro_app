import React from 'react'
import { AtIcon } from 'taro-ui'

export interface IconFontType {
  value: string,
  size?: string | number,
  color?: string
}

const IconFont = (props: IconFontType) => {
  const { value = '#333', size = 32, color } = props
  return(
    <AtIcon prefixClass="iconfont icon" value={value} size={size} color={color} />
  )
}

export default IconFont