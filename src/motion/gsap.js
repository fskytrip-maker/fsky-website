// Single place where GSAP + ScrollTrigger are registered, so every module
// imports the same configured instance.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mobile browsers resize the viewport as the URL bar collapses; refreshing on
// every such resize makes ScrollTrigger jump around.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
