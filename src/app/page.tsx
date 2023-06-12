'use client';

import styles from './page.module.scss'
import React, { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import TopBlock from '@/app/modules/topBlock/TopBlock';
import BottomBlock from '@/app/modules/bottomBlock/bottomBlock';
import Nav from '@/app/modules/navigation/Nav';
import ScreenSize from '@/app/common/hocs/ScreenSizeHoc';

type tcP = {
  setShowNav: Dispatch<SetStateAction<boolean>>
  setVideoPos: Dispatch<SetStateAction<number>>
}

const endPoints = {
  mobile: 300,
  tablet: 300,
  desktop: 600,
}

const checkPosition = ({setShowNav, setVideoPos}: tcP) => {
  const w = (window as any)
  w.currentScrollPos = window.pageYOffset;
  // video
  if (!w.disabledCheck) {
    setVideoPos(Math.min(180 + w.currentScrollPos, 600))
  }

  // nav
  if (w.currentScrollPos === 0 || w.prevScrollPos > w.currentScrollPos || w.disabledCheck) {
    setShowNav(true)
  } else {
    setShowNav(false)
  }
  w.prevScrollPos = w.currentScrollPos;
}

const keys: { [key: string]: number } = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e: Event) {
  console.log(123)
  e.preventDefault();
}

function preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disableScroll() {
  let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  window.addEventListener('DOMMouseScroll', preventDefault, {passive: false}); // older FF
  window.addEventListener(wheelEvent, preventDefault, {passive: false}); // modern desktop
  window.addEventListener('touchmove', preventDefault, {passive: false}); // mobile
  window.addEventListener('touchstart', preventDefault, {passive: false}); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, {passive: false});
}

function enableScroll() {
  let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, false);
  window.removeEventListener('touchmove', preventDefault, false);
  window.removeEventListener('touchstart', preventDefault, false);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

type t = {
  setShowTopBlock: Dispatch<SetStateAction<boolean>>
  setShowBottomBlock: Dispatch<SetStateAction<boolean>>
}

const addAndScroll = ({setShowTopBlock, setShowBottomBlock}: t) => {
  disableScroll()
  const w = (window as any)
  // prevents hiding menu on scroll top ios
  w.disabledCheck = true
  setShowTopBlock(true)

  // put animation in same block as rerender on elem appear to prevent scroll to top
  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: document.documentElement.clientHeight,
    })
  })

  // ios 100ms delay
  setTimeout(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }, 100)

  setTimeout(() => {
    enableScroll()
    // ios 100ms delay
    setTimeout(() => {
      setShowBottomBlock(false)
      w.disabledCheck = false
    }, 100)
  }, 800)
}

const scrollAndRemove = ({setShowTopBlock, setShowBottomBlock}: t) => {
  const w = (window as any)
  // prevents hiding menu on scroll bottom while leaving top block
  w.disabledCheck = true
  disableScroll()

  setShowBottomBlock(true)

  // otherwise async setShowBottomBlock happens after than scrollTo is applied
  setTimeout(() => {
    // ios 100ms delay
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }, 100)

  setTimeout(() => {
    enableScroll()
    // ios 100ms delay
    setTimeout(() => {
      setShowTopBlock(false)
      w.disabledCheck = false
    }, 100)
  }, 800)
}

const appHeight = (setHeight: Dispatch<SetStateAction<number>>) => {
  setHeight(window.innerHeight)
}


const Home = ({screenSize} : any) => {
  console.log(screenSize)
  const [showNav, setShowNav] = useState(true)
  const [height, setHeight] = useState(0)
  const [showTopBlock, setShowTopBlock] = useState(false)
  const [showBottomBlock, setShowBottomBlock] = useState(true)
  const [videoPos, setVideoPos] = useState(180)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const w = (window as any)
    smoothscroll.polyfill();
    // Scrollbar.init(document.querySelector('main'), {});
    w.prevScrollPos = window.pageYOffset;
    window.addEventListener('scroll', () => checkPosition({setShowNav, setVideoPos}))
    window.addEventListener('resize', () => appHeight(setHeight))
    appHeight(setHeight)

    return () => {
      window.removeEventListener('scroll', () => checkPosition({setShowNav, setVideoPos}))
      window.removeEventListener('resize', () => appHeight(setHeight))
    }
  }, [])

  // ios prevent scroll on topBlock display: none
  useLayoutEffect(() => {
    if (!showTopBlock) {
      window.scrollTo({top: 0})
    }

  }, [showTopBlock])

  const scrollAndRemoveApply = () => scrollAndRemove({setShowTopBlock, setShowBottomBlock})
  const addAndScrollApply = () => addAndScroll({setShowTopBlock, setShowBottomBlock})


  return (
    <main className={styles.main} style={{minHeight: `${height}px`}}>
      <Nav ref={navRef} showNav={showNav}/>
      {showTopBlock &&
        <TopBlock showTopBlock={showTopBlock} height={height} scrollAndRemoveApply={scrollAndRemoveApply}/>
      }
      {showBottomBlock &&
        <BottomBlock showBottomBlock={showBottomBlock} addAndScrollApply={addAndScrollApply} videoPos={videoPos}/>
      }
    </main>
  )
}

export default ScreenSize(Home)
