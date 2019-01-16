import * as React from 'react'
import { connect } from 'react-redux'
import { IState } from 'store/index'
import Tree from 'components/shared/ui/Tree'
import TreeHorizontal from 'components/shared/ui/TreeHorizontal'
import Loader from 'components/shared/ui/Loader'
import Error from 'components/shared/ui/Error'
import { TModel as TSitePage } from 'classes/models/SitePage'
import sitePageStoreService from 'classes/services/SitePageStoreService'

export interface Props {
  collapsed?: boolean
  horizontal?: boolean
  sitePagesLoaded: boolean,
  sitePages: TSitePage[]
  currentSitePage: TSitePage,
  toPage: (sitePage: TSitePage) => void
}

const GeneralNavigation = (props: Props) => {
  const { collapsed, sitePagesLoaded, sitePages, currentSitePage, horizontal, toPage } = props

  if (!sitePagesLoaded) {
    return <Loader/>
  }

  const rootSitePage = sitePages.find(i => i.id === 'general-menu')
  if (!rootSitePage) {
    return <Error/>
  }

  return horizontal
    ? <TreeHorizontal
          sitePages={sitePages}
          rootSitePage={rootSitePage}
          currentSitePage={currentSitePage}
          onSitePageClick={toPage}
      />
    : <Tree
          condensed={collapsed}
          sitePages={sitePages}
          rootSitePage={rootSitePage}
          currentSitePage={currentSitePage}
          onSitePageClick={toPage}
      />
}

const mapStateToProps = (state: IState, props: Pick<Props, 'horizontal' | 'collapsed'>): Props => ({
  collapsed: props.collapsed,
  horizontal: props.horizontal,
  sitePagesLoaded: state.sitePagesLoaded,
  sitePages: state.sitePages,
  currentSitePage: sitePageStoreService.getCurrentSitePage(),
  toPage: sitePageStoreService.goToPage,
})

export default connect(mapStateToProps)(GeneralNavigation)
