import styles from './topBlock.module.scss'
import cx from 'classnames'
import React, { useEffect, useRef, useState } from 'react';
import useClickOutside from '@/app/common/hooks/useClickOutside';
import Modal from '@/app/modules/topBlock/modal/Modal';
import DrawingCanvas from '@/app/modules/topBlock/drawing/Drawing';
import html2canvas from 'html2canvas';

type TopBlockProps = {
  height: number,
  showTopBlock: boolean,
  scrollAndRemoveApply: () => void
}

const TopBlock = ({height, showTopBlock, scrollAndRemoveApply}: TopBlockProps) => {
  const modalRef = useRef<HTMLElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [forceClear, setForceClear] = useState<boolean>(false)

  const closeModal = () => {
    setCanvas(null)
  }

  useClickOutside({ref: modalRef, callback: closeModal});

  const clear = () => {
    setForceClear(true)

    setTimeout(() => {
      setForceClear(false)
    })
  }

  const makeScreenShot = () => {
    html2canvas(document.querySelector('#capture') as HTMLCanvasElement).then(res => {
      const canvas1 = document.querySelector('.heatmap-canvas') as HTMLCanvasElement;
      const ctx = res!.getContext('2d');
      ctx!.drawImage(canvas1, 0, 0);
      setCanvas(res)
    })
  }

  const download = () => {
    const element = document.createElement('a');
    element.href = canvas!.toDataURL();
    element.download = 'image.png';
    element.click();
  };

  const checkKeyClick = (event: KeyboardEvent) => {
    if (canvas) {
      if (event.key === 'Enter') {
        // Cancel the default action, just in case
        event.preventDefault();
        // Trigger download
        download()
        setCanvas(null)
      }
    } else {
      if (event.key === 'Enter') {
        // Cancel the default action, just in case
        event.preventDefault();
        // Trigger screenshot
        makeScreenShot()
      }

      if (event.key.toLowerCase() === 'c') {
        // Cancel the default action, just in case
        event.preventDefault();
        // Trigger clear
        clear()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', checkKeyClick);

    return () => {
      document.removeEventListener('keypress', checkKeyClick);
    }

  }, [checkKeyClick])

  return (
    <div style={{height: `${height}px`}} className={cx(styles.topBlock, {[styles.show]: showTopBlock})}>
      {!!canvas && <Modal canvas={canvas} ref={modalRef}/>}
      <DrawingCanvas height={height} forceClear={forceClear}/>
      <button
        onClick={scrollAndRemoveApply}
        className={cx(styles.animationTrigger, styles.drawing)}
      >
        вниз
      </button>
      <div className={cx(styles.buttonContainer, styles.screenshot, {[styles.disabled]: !!canvas})}>
        <button
          onClick={makeScreenShot}
        >Enter
        </button>
      </div>
      <div className={cx(styles.buttonContainer, styles.clear, {[styles.disabled]: !!canvas})}>
        <button
          onClick={clear}
        >c
        </button>
      </div>
    </div>
  )
}

export default TopBlock
