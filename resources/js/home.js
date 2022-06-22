const sections = document.querySelectorAll('section')


//snow
let snowCount = Math.round((window.innerWidth / 10) * (1 / 3))
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
if (window.innerWidth > 720) {
  createSnowCSS(snowCount)
  createSnow(snowCount)
} else {
  document.getElementById('snow-div').removeAttribute("data-parallax");
}

function offsetTop(e, acc = 0){
  if(e.offsetParent){
    return offsetTop(e.offsetParent, acc + e.offsetTop)
  }
  return acc + e.offsetTop
}
class Parallax {
  constructor(e) {
    this.e = e
    this.e.parentNode.style.overflowY = 'hidden'
    this.e.style.position = 'relative'
    this.ratio = parseFloat(e.dataset.parallax)
    this.onScroll = this.onScroll.bind(this)
    document.addEventListener('scroll', this.onScroll)
  }

  onScroll(){
    const elementY = offsetTop(this.e) + this.e.offsetHeight/2
    const screenCenter = window.innerHeight/2
    const screenY = window.scrollY + screenCenter

    const diffY = ((elementY<screenCenter)? screenCenter:elementY) - screenY
    this.e.style.transform = `translateY(${diffY * -1 *this.ratio}px)`
  }

  static bind(){
    Array.from(document.querySelectorAll('[data-parallax]')).map((e)=>{
      return new Parallax(e)
    })
  }
}
Parallax.bind()

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
sections.forEach((section) => {
  observer.observe(section)
})

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
      (e.style.background = 'radial-gradient(150% 225% at '
        .concat(((c + o) / n) * 100, '% ')
        .concat(((l + o) / r) * 100, '%, #EE04C9 0%, #6100FF 100%)'))
  }),
    (e.onmouseleave = function () {
      e.style.backgroundPosition = '100% 50%'
    })
})



//compétence

const competences = document.getElementById('competences')
const technologies = competences.querySelectorAll('figure')
technologies.forEach((t) => {
  let isHover;
  t.onclick = () => {
    t.classList.toggle('open')
  }
  t.onmouseenter = () => {
    window.clearTimeout(isHover);
    isHover = setTimeout(() =>{
      t.classList.add('open')
    }, 500);
  }
  t.onmouseleave = () => {
    window.clearTimeout(isHover);
    isHover = setTimeout(() =>{
      t.classList.remove('open')
    }, 350);
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
const otherInput = document.getElementById('other')
const otherLabel = document.querySelector('#other ~ label')
const services = document.querySelectorAll('.services .input-container')

contactForm.querySelector('*').oninput = (e) => {
  const el = e.target
  el.classList.remove('error')
  el.labels[0].classList.remove('error')
}

otherLabel.oninput = () => {
  otherInput.value = otherLabel.innerHTML
  otherInput.classList.remove('error')
  document.getElementById(otherInput.htmlFor).classList.remove('error')
}
otherLabel.addEventListener('click', (e) => {
  if(otherInput.checked){
    e.preventDefault()
  } else {
    e.preventDefault()

    otherInput.checked = true
    otherLabel.innerHTML = ''
  }
})
services.forEach((service) => {
  service.onclick = (e) => {
    if(service.querySelector('label') !== otherLabel){
      otherInput.checked = false
      otherLabel.innerHTML = 'Autre'
    }
  }
})

contactForm.addEventListener('submit', (e) => {
  e.preventDefault()
  fetch(contactForm.action, { method: contactForm.method, body: new FormData(contactForm) }).then(
    (response) => {
      if (response.ok) {
        contactForm.message.value = ''
        let submit = contactForm.querySelector("input[type='submit']")
        submit.value = 'Message envoyé'
        submit.classList.add('send')

        setTimeout(() => {
          submit.value = 'Envoyer le message'
          submit.classList.remove('send')
        }, 3500)
      } else {
        response.json().then((json) => {
          let first
          Object.entries(json).forEach(([key, value]) => {
            let inputError = []
            inputError.push(contactForm[key])
            if (first === undefined) {
              first = inputError[0]
            }
            inputError.forEach((input) => {
              console.log(input[3])
              if(input[3] === otherInput){
                otherInput.classList.add('error')
              } else {
                input.classList.add('error')
                input.labels[0].add('error')
              }
            })
          })
          first.scrollIntoView({ block: 'center' })
        })
      }
    }
  )
})


//backToTop
const backToTop = document.getElementById('back-to-top')

end = new IntersectionObserver(
  function (entries) {
    entries.forEach( (entry) => {
      if (entry.isIntersecting) {
        backToTop.classList.remove('hidden')
      } else {
        backToTop.classList.add('hidden')
      }
    })
  },
  {
    threshold: [0.25],
  }
)
end.observe(document.getElementById('contact'))

