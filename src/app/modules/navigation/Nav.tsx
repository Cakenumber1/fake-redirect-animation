import styles from './nav.module.scss'
import React, { ReactElement, Ref } from 'react';
import cx from 'classnames'

type NavProps = {
  showNav: boolean
}

const NavComponent = (props: NavProps, ref: Ref<HTMLElement>) => (
  <nav ref={ref} className={cx(styles.navbar, {[styles.show]: props.showNav})}>
    <a href="#home">Home</a>
    <a href="#news">News</a>
    <a href="#contact">Contact</a>
  </nav>
)

// Cast the output
const Nav = React.forwardRef(NavComponent) as
  <T extends NavProps>(props: NavProps & { ref?: Ref<HTMLElement> }) => ReactElement

export default Nav
