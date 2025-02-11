import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 0.016 // Initialize with a typical frame time in seconds

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = (currentTime - this.current) / 1000 // Convert milliseconds to seconds
        this.current = currentTime
        this.elapsed = (this.current - this.start) / 1000 // Convert milliseconds to seconds

        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}