import * as React from 'react'

export interface HelloProps {
  title: string
  style?: React.CSSProperties
  prefixCls?: string
  className?: string
}

export interface HelloState {
  affixStyle?: React.CSSProperties
}

class Hello extends React.Component<HelloProps, HelloState> {
  state = {}

  render() {
    const { title } = this.props
    return <div className={'hd-ui-react__title'}>{title}</div>
  }
}

export default Hello
