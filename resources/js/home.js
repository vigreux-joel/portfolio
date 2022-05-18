const sections = document.querySelectorAll('section')

window.addEventListener('scroll', () => {
  sections.forEach((section) => {
    observer.observe(section)
  })

  moveYElement()
})
moveYElement()
function moveYElement() {
  const elements = document.querySelectorAll('.move-y')
  elements.forEach((element) => {
    const parent = element.parentNode
    parent.style.overflowY = 'hidden'
    element.style.position = 'relative'

    const scrollY = window.scrollY
    let top = Math.floor(window.scrollY + element.getBoundingClientRect().top)

    let centerYElement = top + element.offsetHeight / 2 - window.innerHeight / 2
    if (centerYElement < 0) centerYElement = 0
    let diff = -scrollY + centerYElement

    let amplifier = element.dataset.amplifier ?? 1
    element.style.top = `${diff * amplifier}px`
  })
}

observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        el = entry.target
        setCurrentOnglet(el.id)
      }
    })
  },
  {
    threshold: [0.6],
  }
)

const links = document.querySelectorAll('header .links a')
const linksAfter = document.querySelector('header .links .after')
function setCurrentOnglet(id) {
  history.replaceState({}, '', '#' + id)

  links.forEach((link) => {
    link.classList.remove('current')
  })
  let current = links[0].parentNode.querySelector('a[href="#' + id + '"]')
  if (current) {
    current.classList.add('current')
    linksAfter.style.width = current.offsetWidth - 2 * 16 + 'px'
    linksAfter.style.left = current.offsetLeft + current.offsetWidth / 2 + 'px'
  } else {
    linksAfter.style.width = '0'
  }
}

//snow
let snowCount = 75

function createSnow(snow_density) {
  for (let x = 0; x < snow_density - 1; x++) {
    let board = document.createElement('div')
    board.className = 'snow'
    document.getElementById('snow-div').appendChild(board)
  }
}

// Append style for each snowflake to the head
function add_css(rule) {
  const css = document.createElement('style')
  css.type = 'text/css'
  css.appendChild(document.createTextNode(rule)) // Support for the rest
  document.getElementsByTagName('head')[0].appendChild(css)
}

// Math
function randomRange(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}

// Create style for snowflake
function createSnowCSS(snow_density) {
  let rule = ``
  for (let i = 1; i < snow_density; i++) {
    let xDefault = randomRange(0, 100)
    let xRange = randomRange(-15, 15)
    let yBreak = randomRange(30, 80) * 100
    let fallDuration = randomRange(8, 30)
    let fallDelay = randomRange(8, 30)

    rule += `
        .snow:nth-child(${i}) {
            opacity: ${randomRange(0, 0.75)};
            transform: translate(${xDefault}vw, -10px) scale(${Math.random()});
            animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
        }

        @keyframes fall-${i} {
            ${yBreak * 100}% {
                opacity: ${randomRange(0, 0.75)};
                transform: translate(${xDefault + xRange}vw, ${yBreak}vh) scale(${Math.random()});
            }

            to {
                opacity: ${randomRange(0, 0.75)};
                transform: translate(${xDefault + xRange / 2}vw, 100vh) scale(${Math.random()});
            }

        }
        `
  }

  add_css(rule)
}

createSnowCSS(snowCount)
createSnow(snowCount)
