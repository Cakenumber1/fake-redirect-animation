import styles from './modal.module.scss'
import React, { ReactElement, Ref } from 'react';

type ModalProps = {
  canvas: HTMLCanvasElement
}

const ModalComponent = (props: ModalProps, ref: Ref<HTMLElement>) =>
  (
  <aside ref={ref} className={styles.modal}>
    <div className={styles.imageContainer}>
      <img src={props.canvas!.toDataURL()} alt="screenshot"/>
    </div>
    <div className={styles.downloadContainer}>
      <span className={styles.text}>Поделитесь рисунком</span>
      <a className={styles.download} href={props.canvas!.toDataURL()} download="myimage.png">
        скачать [img]
      </a>
    </div>
  </aside>
)

// Cast the output
const Modal = React.forwardRef(ModalComponent) as
  <T extends ModalProps>(props: ModalProps & { ref?: Ref<HTMLElement> }) => ReactElement

export default Modal
