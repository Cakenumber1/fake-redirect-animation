"use client";

import styles from './page.module.scss'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import cx from 'classnames'

const checkPosition = (setShowNav: Dispatch<SetStateAction<boolean>>) => {
    const w = (window as any)
    w.currentScrollPos = window.pageYOffset;
    if (w.prevScrollPos > w.currentScrollPos) {
        setShowNav(true)
    } else {
        setShowNav(false)
    }
    w.prevScrollPos = w.currentScrollPos;
}

const keys = {37: 1, 38: 1, 39: 1, 40: 1};
function preventDefault(e: any) {
    console.log(123)
    e.preventDefault();
}

function preventDefaultForScrollKeys(e: any) {
    // @ts-ignore
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
    window.addEventListener('keydown', preventDefaultForScrollKeys, {passive: false});
}

function enableScroll({setShowBottomBlock, setShowTopBlock}: t2) {
    let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, false);
    window.removeEventListener('touchmove', preventDefault, false);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);

    setShowBottomBlock?.(false)
    setShowTopBlock?.(false)
}

type t = {
    setShowTopBlock: Dispatch<SetStateAction<boolean>>
    setShowBottomBlock: Dispatch<SetStateAction<boolean>>
}

type t2 = {
    setShowBottomBlock?: Dispatch<SetStateAction<boolean>>
    setShowTopBlock?: Dispatch<SetStateAction<boolean>>
}

const addAndScroll = ({setShowTopBlock, setShowBottomBlock} : t) => {
    disableScroll()
    setShowTopBlock(true)

    // no clue why macroEvent not working here
    window.scrollBy({
        top: 1,
    })

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })

    setTimeout(() => {
        enableScroll({setShowBottomBlock})
    }, 1000)
}

const scrollAndRemove = ({setShowTopBlock, setShowBottomBlock} : t) => {
    disableScroll()

    setShowBottomBlock(true)

    // otherwise async setShowBottomBlock happens after than scrollTo is applied
    setTimeout(() => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        })
    })

    setTimeout(() => {
        enableScroll({setShowTopBlock})
    }, 1000)
}

export default function Home() {
    const [showNav, setShowNav] = useState(true)
    const [showTopBlock, setShowTopBlock] = useState(false)
    const [showBottomBlock, setShowBottomBlock] = useState(true)
    const navRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const w = (window as any)
        w.prevScrollPos = window.pageYOffset;
        window.addEventListener("scroll", (event) => checkPosition(setShowNav))

        return () => window.removeEventListener("scroll", (event) => checkPosition(setShowNav))

    }, [])

    useEffect(() => {

    }, [])


    return (
        <main className={styles.main}>
            <nav ref={navRef} className={cx(styles.navbar, {[styles.show]: showNav})}>
                <a href="#home">Home</a>
                <a href="#news">News</a>
                <a href="#contact">Contact</a>
            </nav>

            <div className={cx(styles.topBlock, {[styles.show]: showTopBlock})}>
                <button
                    onClick={() => scrollAndRemove({setShowTopBlock, setShowBottomBlock})}
                    className={cx(styles.animationTrigger, styles.drawing)}
                >вниз
                </button>
            </div>
            <div className={cx(styles.bottomBlock, {[styles.show]: showBottomBlock})}>
                <button
                    className={styles.animationTrigger}
                    type="button"
                    onClick={() => addAndScroll({setShowTopBlock, setShowBottomBlock})}
                >
                    start animation ^
                </button>

                <div className={styles.content}>
                    <p><b>This example demonstrates how to hide a navbar when the user starts to scroll the page.</b></p>
                    <p>Scroll down this frame to see the effect!</p>
                    <p>Scroll up to show the navbar.</p>
                    <p>Lorem ipsum dolor dummy text sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Lorem ipsum dolor dummy text sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </main>
    )
}
