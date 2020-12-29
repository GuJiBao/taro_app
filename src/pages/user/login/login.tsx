import React, { Component, useState } from 'react'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { View, Text, Button, Label, Checkbox, BaseEventOrigFunction } from '@tarojs/components'
import { AtNavBar, AtForm, AtInput } from 'taro-ui'
import './login.scss'
import { sendCode } from '@/services/user'

const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
interface FormTitleProps {
  title: string
}
interface SendCodeProps {
  phone: string
}

interface AgreeProps {
  onCheck: BaseEventOrigFunction<{ value: string[]; }>
}

/**
 * 返回组件
 */
const Nav: React.FC = () => {
  return (
    <AtNavBar
      leftIconType="chevron-left"
      color="#242629"
      fixed={true}
      border={false}
    >
    </AtNavBar>
  )
}

/**
 * 表单头部组件
 * @param props 
 */
const FormTitle: React.FC<FormTitleProps> = (props) => {
  const { title } = props
  return (
    <Text className="form-title">{title}</Text>
  )
}

/**
 * 发送验证码组件
 */
const SendCode: React.FC<SendCodeProps> = (props) => {
  const [time, setTime] = useState<number>(0)
  const { phone } = props

  const codeClass = classnames('send-code', {
    'send-code-disabled': !!time
  })

  const setCountDownTime = (num: number) => {
    setTimeout(() => {
      setTime(num)
      num--
      if (num >= 0) {
        setCountDownTime(num)
      }
    }, 1000)
  }

  const getCode = async (phone: string) => {
    Taro.showLoading({
      title: '发送中',
    })
    const {code, msg} = await sendCode({
      phone
    })
    Taro.hideLoading()
    if (code === 0) {
      // 设置倒计时
      setCountDownTime(60)
    } else {
      Taro.showToast({
        title: msg,
        icon: 'none',
        duration: 2000
      })
    }
  }

  const handleSendClick = () => {
    if (time) return
    if (!phoneReg.test(phone)) {
      Taro.showToast({
        title: '请检查您的手机号码',
        icon: 'none'
      })
      return
    }
    getCode(phone)
  }

  return (
    <View className={codeClass} onClick={handleSendClick}>{time ? `${time}s` : '发送验证码'}</View>
  )
}

const Agree: React.FC<AgreeProps> = (props) => {
  const item = {
    value: 'agree',
    checked: false
  }
  return (
    <View className="agree">
      <Label className="check-box">
        <Checkbox
          value={item.value}
          onClick={props.onCheck}
          checked={item.checked}
          color="#FFD462"
          ></Checkbox>
      </Label>
      
      <Text className="text">同意《闪时送用户协议/隐私协议》</Text>
    </View>
  )
}

const WrapForm: React.FC = () => {
  const [phone, setPhone] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const title = '登录/注册'

  const handleChange = (value, type: string) => {
    switch(type) {
      case 'phone':
        setPhone(value)
        break
      case 'code':
        setCode(value)
        break
    }
  }

  const handleAgreeCheck = (ev) => {
    console.log(ev.target.checked)
  }

  const onSubmit = () => {
    if (!phoneReg.test(phone)) {
      Taro.showToast({
        title: '请检查您的手机号码',
        icon: 'none'
      })
      return
    }
    if (!code) {
      Taro.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return
    }
    console.log(phone, code)
  }

  return (
    <View>
      <View className="form-box">
        <FormTitle title={title} />
        <AtForm
          className="no-after form"
          onSubmit={onSubmit}
        >
          <AtInput
            className="input-phone"
            type="phone"
            name="phone"
            border={false}
            placeholder="请输入手机号码"
            value={phone}
            onChange={(value) => handleChange(value, 'phone')}
          />
          <View className="at-row code-box">
            <AtInput
              className="at-col input-code"
              type="number"
              name="code"
              border={false}
              value={code}
              onChange={value => handleChange(value, 'code')}
            />
            <View className="at-col">
              <SendCode phone={phone} />
            </View>
          </View>
          <Button className="login-btn" hoverClass="none" formType='submit'>登录</Button>
        </AtForm>
      </View>
      {/* <Agree onCheck={handleAgreeCheck} /> */}
    </View>
  )
}

class Login extends Component {
  render() {
    return (
      <View className="login-wrap">
        <Nav />
        <WrapForm />
      </View>
    )
  }
}

export default Login