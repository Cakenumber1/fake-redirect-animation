/* eslint-disable */
import React, { useEffect } from 'react'
import h337 from 'heatmap.js'

let isEnable = true
const selector = '.heatmap'
let layers = []
const intervals = []
const timeouts = []
const stopRemoving = []
let isMobile = false

const resize = () => {
  if (!layers[0]) {
    return
  }

  const width = window.innerWidth,
    height = window.innerHeight,
    heatmapHeight = document.querySelector('.heatmap').offsetHeight

  if (height < 650) {
    layers[0]._renderer.canvas.height = heatmapHeight
    layers[0]._renderer.shadowCanvas.height = heatmapHeight
    layers[0]._renderer._height = heatmapHeight
    //me.layers[0]._renderer.Canvas2dRenderer._height = heatmapHeight;
  } else {
    layers[0]._renderer.canvas.height = height
    layers[0]._renderer.shadowCanvas.height = height
    layers[0]._renderer._height = height
  }

  layers[0]._renderer.canvas.width = width
  layers[0]._renderer.shadowCanvas.width = width
  layers[0]._renderer._width = width

  layers[0].setData(layers[0].getData())
}

const init = () => {
  isMobile = checkMobile()

  setupLayers()
  resize();

  (isMobile)
    ? setupClick()
    : setupMouseMove()

  window.addEventListener('resize', resize)
}

const setupLayers = () => {
  document.querySelectorAll(selector).forEach((el) => {
    const heatmapLayer = h337.create({
      container: el,
      radius: 10,
      maxOpacity: 1,
      minOpacity: 0,
      blur: .75,
      gradient: {
        '.5': '#ff7300',
        '.8': '#FFD600',
        '.95': '#FC3000',
      },
    })

    layers.push(heatmapLayer)
  })
}

const setupMouseMove = () => {
  document.querySelectorAll(selector).forEach((el, i) => {
    layers[i].setData({
      max: 10,
      min: 0,
      data: [],
    })

    el.parentElement.addEventListener('mousemove', (e) => {
      clearInterval(intervals[i])
      clearTimeout(timeouts[i])
      intervals[i] = null

      const posX = e.pageX - el.offsetLeft
      const posY = e.pageY - el.offsetTop

      const point = {
        x: posX,
        y: posY,
        radius: 40,
        value: 3,
      }

      const temp = layers[i].getData()

      temp.data.push(point)
      layers[i].setData(temp)

      timeouts[i] = setTimeout(() => {
        intervals[i] = removePoints(i)
      }, 2000)
    })
  })
}

const setupClick = () => {
  document.querySelectorAll(selector).forEach((el, i) => {
    layers[i].setData({
      max: 10,
      min: 0,
      data: [],
    })

    el.parentElement.addEventListener('touchmove', (e) => {
      clearInterval(intervals[i])
      clearTimeout(timeouts[i])

      stopRemoving[i] = true
      intervals[i] = null

      const touches = e.touches

      const posX = touches[0].pageX - el.offsetLeft
      const posY = touches[0].pageY - el.offsetTop

      const point = {
        x: posX,
        y: posY,
        radius: 40,
        value: 10,
      }

      const temp = layers[i].getData()

      temp.data.push(point)
      layers[i].setData(temp)

      timeouts[i] = setTimeout(() => {
        if (navigator.userAgent.match(/Android/i)) {
          isEnable = false
        } else {
          intervals[i] = removePoints(i)
        }
      }, 2000)
    }, {
      passive: true,
    })
  })
}

const removePoints = (i) => {
  const interval = setInterval(function () {
    const layerData = layers[i].getData()

    if (layerData.data.length === 0) {
      clearInterval(interval)
    }

    const newData = {
      max: 10,
      min: 0,
      data: [],
    }

    for (let j = 0; j < layerData.data.length; j++) {
      const point = layerData.data[j]

      if (point.value >= 10) {
        point.fresh = false
      }

      point.value = point.value - 0.05

      if (point.value > 0) {
        newData.data.push(layerData.data[j])
      }
    }

    layers[i].setData(newData)
  }, 10)

  return interval
}

const checkMobile = () => {
  let check = false;

  // eslint-disable-next-line max-len
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
      check = true
    }
  })(window.navigator.userAgent || window.navigator.vendor || window.opera)

  return check
}

const clearAll = () => {
  layers.forEach((layer, i) => {
    clearInterval(intervals[i])
    clearTimeout(timeouts[i])

    layers[i].setData({
      max: 10,
      min: 0,
      data: [],
    })
  })
}

const DrawingHoc = Component => (props) => {
  useEffect(() => {
    init()
    console.log('mount')

    return () => {
      console.log('unmount')
      clearAll()
      layers = []
      window.removeEventListener('resize', resize)
    }
  }, [])

  if (props.isMenuOpen || props.forceClear) {
    clearAll()
  }

  return (
    <div>
      <div className="heatmap"/>
      <Component {...props} />
    </div>
  )
}


export default DrawingHoc
