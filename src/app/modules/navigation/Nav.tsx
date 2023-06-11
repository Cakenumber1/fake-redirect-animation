import styles from './nav.module.scss'
import React from 'react';
import cx from 'classnames'

type NavProps = {
  showNav: boolean
}

const Nav = React.forwardRef<HTMLElement>(({showNav}: NavProps, ref) => (
  <nav ref={ref} className={cx(styles.navbar, {[styles.show]: showNav})}>
    <a href="#home">Home</a>
    <a href="#news">News</a>
    <a href="#contact">Contact</a>
  </nav>
));

Nav.displayName = 'Nav';

export default Nav
