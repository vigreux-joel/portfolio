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

//button
document.querySelectorAll('.radial-button').forEach(function (e) {
  window.addEventListener('mousemove', function (t) {
    const o = window.innerHeight
    const n = 2 * o + e.clientWidth
    const r = 2 * o + e.clientHeight
    const c = t.clientX - e.offsetLeft
    const l = t.clientY - e.getBoundingClientRect().top
    c > -o &&
      l > -o &&
      c - e.clientWidth < o &&
      l - e.clientHeight < o &&
      (e.style.background = 'radial-gradient(100% 175% at '
        .concat(((c + o) / n) * 100, '% ')
        .concat(((l + o) / r) * 100, '%, #EE04C9 0%, #6100FF 100%)'))
  }),
    (e.onmouseleave = function () {
      e.style.backgroundPosition = '100% 50%'
    })
})

//snow
let snowCount = Math.round((window.innerWidth / 10) * (2 / 3))
if (snowCount > 175) {
  snowCount = 175
}

function createSnow(snow_density) {
  for (let x = 0; x < snow_density - 1; x++) {
    let board = document.createElement('div')
    board.className = 'snow'
    document.getElementById('snow-div').appendChild(board)
  }
}

function add_css(rule) {
  const css = document.createElement('style')
  css.appendChild(document.createTextNode(rule)) // Support for the rest
  document.getElementsByTagName('head')[0].appendChild(css)
}

function randomRange(min = 0, max = 1) {
  const value = Math.random() * (max - min) + min
  return Math.round(value * 100) / 100
}

// Create style for snowflake
function createSnowCSS(snow_density) {
  let rule = ``
  for (let i = 1; i < snow_density; i++) {
    let xDefault = randomRange(0, 100)
    let xRange = randomRange(-15, 15)
    let yBreak = randomRange(30, 80)
    let fallDuration = randomRange(8, 20)
    let fallDelay = randomRange(0, 10)

    rule += `
        .snow:nth-child(${i}) {
            opacity: ${randomRange(0, 0.75)};
            transform: translate(${xDefault}vw, -10px) scale(${randomRange(0, 1)});
            animation: fall-${i} ${fallDuration}s ${fallDelay}s linear infinite;
        }

        @keyframes fall-${i} {
            ${yBreak}% {
                opacity: ${randomRange(0, 0.75)};
                transform: translate(${xDefault + xRange}vw, ${yBreak}vh) scale(${randomRange(
      0,
      1
    )});
            }

            to {
                opacity: ${randomRange(0, 0.75)};
                transform: translate(${xDefault + xRange / 2}vw, 100vh) scale(${randomRange(0, 1)});
            }

        }
        `
  }

  add_css(rule)
}
createSnowCSS(snowCount)
createSnow(snowCount)

//compétence
const competences = document.getElementById('competences')
const technologies = competences.querySelectorAll('figure')
technologies.forEach((t) => {
  t.onclick = () => {
    t.classList.toggle('open')
  }
})
competences.onclick = (e) => {
  technologies.forEach((t) => {
    if (!t.contains(e.target)) {
      t.classList.remove('open')
    }
  })
}

//contact
const contactForm = document.forms.contact
const submit = contactForm.querySelector("input[type='submit']")

contactForm.querySelector('*').oninput = (e) => {
  e.target.classList.remove('error')
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault()
  fetch(contactForm.action, { method: contactForm.method, body: new FormData(contactForm) }).then(
    (response) => {
      if (response.ok) {
        window.alert('message envoyé!')
      } else {
        response.json().then((json) => {
          let first
          Object.entries(json).forEach(([key, value]) => {
            console.log(key, value)
            let inputError = []
            inputError.push(contactForm[key])
            if (first === undefined) {
              first = inputError[0]
            }
            inputError.forEach((input) => {
              input.classList.add('error')
            })
          })
          first.scrollIntoView({ block: 'center' })
        })
      }
    }
  )
})
