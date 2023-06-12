import styles from './drawing.module.scss'
import DrawingHoc from '@/app/common/hocs/DrawingHoc';

type Props = {
  height: number
}

const DrawingCanvas = ({height} : Props) => (
    <figure id="capture" style={{height: `${height}px`}} className={styles.drawingCanvas}>
      <div className={styles.logo} />
    </figure>
  )

export default DrawingHoc(DrawingCanvas)
