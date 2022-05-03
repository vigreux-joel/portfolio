const sections = document.querySelectorAll('section')

window.addEventListener('scroll', () => {
  sections.forEach((section) => {
    observer.observe(section)
  })

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
})

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

//projet
document.querySelectorAll('#projets article .images').forEach((images) => {
  images.onclick = () => {
    images.classList.toggle('active')
  }
})

//competance transform: rotate3d(49, 190, 56, -69deg);
// }
const scrollDiv = document.querySelector('#competances .scroll')
onScroll()
console.log('reerggre')
scrollDiv.parentNode.onscroll = function () {
  onScroll()
}

function onScroll() {
  let x = -1
  let y = -1
  let z = Math.abs(8)

  scrollDiv.style.transform = `rotate3d(${x}, ${y}, ${z}, -30deg) translate3d(-78px, -85px, 0px)`
  const images = scrollDiv.querySelectorAll('img')
  images.forEach((image) => {
    image.style.transform = `rotate3d(${Math.abs(x)}, ${Math.abs(y)}, ${Math.abs(z)}, -30deg)`
  })
}
