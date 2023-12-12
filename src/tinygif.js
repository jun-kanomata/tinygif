import Recorder from './recorder'

export default class Tinygif {
  constructor(options={}) {
    let defaults = {
      prerender: true,
      loop: 0,
      fps: 50,
      seconds: 5,
      frames: null,
      width: null,
      height: null,
      sample: 30,
      autoStop: true,
      recordingProgress: () => {},
      renderingProgress: () => {},
    }

    this.options = Object.assign({}, defaults, options)
    this.recorder = null
  }

  capture(recorder, canvas, context, count) {
    recorder.capture(canvas, context)
    this.options.recordingProgress(count)
  }

  record(canvas) {
    return new Promise((resolve, reject) => {
      this.done = null;

      let complete = (blob) => {
        resolve(blob)
      }

      let error = (err) => {
        reject(err)
      }

      let tick = 1000 / this.options.fps
      let delay = tick / 10

      this.recorder = new Recorder({
        loop: this.options.loop,
        delay: delay | 0,
        width: canvas.width,
        height: canvas.height,
        sample: this.options.sample,
        progress: this.options.renderingProgress,
        complete: complete
      })

      let start = Date.now()
      let count = 0
      let context = canvas.getContext('2d') || canvas.getContext('webgl')

      this.recorder.start()
      this.captureInterval = setInterval(() => {
        let elapsed = Date.now() - start
        try {
          this.capture(this.recorder, canvas, context, count)
        } catch(err) {
          this.done = Date.now()
          this.recorder.error(err)
          if (this.captureInterval) clearInterval(this.captureInterval)
          error(err)
          return
        }
        count++
        if (this.options.autoStop) {
          var maxFrames = this.options.frames
          var maxElapsed = this.options.seconds ? (this.options.seconds * 1000) : null
          if ((maxFrames && (count >= maxFrames)) || (maxElapsed && (elapsed >= maxElapsed))) {
            this.stop().then(resolve).catch(reject)
            return
          }
        }
      }, tick)
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this.captureInterval) {
        clearInterval(this.captureInterval)
        this.captureInterval = null
      }

      if (this.recorder) {

        this.recorder.stop()
        this.recorder.complete = (blob) => {
          resolve(blob)
        }

        this.recorder.error = (err) => {
          reject(err)
        }
      } else {
        reject(new Error("Recorder is not initialized"))
      }
    })
  }
}
