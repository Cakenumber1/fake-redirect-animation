import styles from './bottomBlock.module.scss'
import cx from 'classnames'

type BottomBlockProps = {
  showBottomBlock: boolean,
  addAndScrollApply: () => void,
  videoPos: number
}

const BottomBlock = ({showBottomBlock, addAndScrollApply, videoPos}: BottomBlockProps) => {
  return (
    <div className={cx(styles.bottomBlock, {[styles.show]: showBottomBlock})}>
      <button
        className={styles.animationTrigger}
        type="button"
        onClick={addAndScrollApply}
      >
        start animation ^
      </button>
      <div className={styles.video}
           style={{top: `${videoPos}px`}}>
        <video
          autoPlay
          muted
          loop
          width={videoPos}
        >
          <source src="http://www.adrianparr.com/download/keyboard-video.mp4" type="video/mp4" />
          Your browser doesnt support HTML5 video tag.
        </video>
      </div>
      <div className={styles.content}>
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
  )
}

export default BottomBlock
