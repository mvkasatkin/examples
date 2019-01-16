import * as React from 'react'
import Loader from './Loader'
import { Theme, WithStyles, withStyles, createStyles } from 'config/theme'

export interface Props {
  src: string
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}
interface State {
  seq: number
  isLoaded: boolean
}

class IFrame extends React.PureComponent<Props & WithStyles<typeof styles>, State>{
  state: State = { isLoaded: false, seq: 0 }

  componentWillUpdate(prevProps: Props) {
    const srcChanged = prevProps.src !== this.props.src
    const widthChanged = prevProps.width !== this.props.width
    const heightChanged = prevProps.height !== this.props.height
    if (srcChanged || widthChanged || heightChanged) {
      this.setState({ isLoaded: false, seq: this.state.seq + 1 })
    }
  }

  render() {
    const { src, width, height, className, style, classes } = this.props
    const { isLoaded, seq } = this.state

    return (
      <React.Fragment>
        <iframe
          key={seq}
          src={src}
          className={`${classes.root} ${className || ''}`}
          style={{ ...style, width, height }}
          onLoad={() => this.setState({ isLoaded: true })}
        />
        {isLoaded || <Loader/>}
      </React.Fragment>
    )
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
    border: 'none',
    zIndex: 0,
  },
})

export default withStyles(styles)(IFrame)
