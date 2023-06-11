import styles from './topBlock.module.scss'
import cx from 'classnames'


export default function TopBlock({height, showTopBlock, scrollAndRemoveApply}) {
  return (
    <div style={{height: `${height}px`}} className={cx(styles.topBlock, {[styles.show]: showTopBlock})}>
      <button
        onClick={scrollAndRemoveApply}
        className={cx(styles.animationTrigger, styles.drawing)}
      >
        вниз
      </button>
      <div>

      </div>
    </div>
  )
}
