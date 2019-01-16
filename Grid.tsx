import * as React from 'react'
import * as GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { SizeMe } from 'react-sizeme'
import { Theme, WithStyles, withStyles, createStyles } from 'config/theme'

export interface Layout extends GridLayout.Layout {}

export interface Props extends GridLayout.ReactGridLayoutProps {
  layout: Layout[]
  onLayoutChange?: (layout: Layout[]) => void
}

class Grid extends React.PureComponent<Props & WithStyles<typeof styles>>{
  render() {
    const { layout, classes, onLayoutChange } = this.props

    return (
      <SizeMe>
        {({ size: { width } }) => (
          <GridLayout
            { ...this.props }
            className={`layout ${classes.root}`}
            layout={layout}
            cols={12}
            rowHeight={1}
            containerPadding={[0, 0]}
            width={width || 1200}
            compactType={'vertical'}
            onLayoutChange={onLayoutChange}
          >
            {this.props.children}
          </GridLayout>
        )}
      </SizeMe>
    )
  }
}

const styles = (theme: Theme) => createStyles({
  root: {
  },
})

export default withStyles(styles)(Grid)
