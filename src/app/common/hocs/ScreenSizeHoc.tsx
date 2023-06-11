import React from 'react'

const ScreenSize = Component => (
  // eslint-disable-next-line
  class extends React.Component<any, any> {
    state = {
      width: null,
      height: null,
    }

    componentDidMount() {
      this.handleResize()

      window.addEventListener('resize', this.handleResize)
      window.addEventListener('orientationchange', this.handleOrientationChange)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
      window.removeEventListener('orientationchange', this.handleOrientationChange)
    }

    handleResize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleOrientationChange = () => {
      this.setState(state => ({
        width: state.height,
        height: state.width,
      }))
    }

    render() {
      const screenSize = {
        width: this.state.width,
        height: this.state.height,
      }

      return (
        <Component
          screenSize={screenSize}
          {...this.props}
        />
      )
    }
  }
)

export default ScreenSize
