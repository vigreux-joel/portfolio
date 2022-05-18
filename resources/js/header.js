//Constants that I reuse in my header.js script
const buttonMenu = document.getElementById('button-menu')
const header = document.querySelector('header')
const links = header.querySelectorAll('.links a')
const linksAfter = header.querySelector('.links .after')

//Operate the burger menu
buttonMenu.onclick = () => {
  header.classList.toggle('close')
  header.classList.toggle('open')
}
header.onclick = function (e) {
  header.classList.contains('open') &&
    (e.target.classList.contains('row') ||
      'HEADER' === e.target.nodeName ||
      'A' === e.target.nodeName ||
      'BUTTON' === e.target.nodeName) &&
    buttonMenu.click()
}

//Allows you to activate once by default the "onscroll" function to check when the user updates this page
scroll(scrollY)

let scrollYOld = 0
let scrollAmount = 0
window.onscroll = () => {
  //allows you to hide or show the menu according to the user’s scroll direction
  if (scrollY > scrollYOld && scrollY !== 0) {
    header.classList.add('hidden')
    scrollAmount = window.scrollY - 100
  } else if (window.scrollY <= scrollAmount || scrollY === 0) {
    header.classList.remove('hidden')
  }
  scrollYOld = window.scrollY

  //allows to run the "onscroll" function
  scroll(scrollY)
}

//allows you to add opacity to the menu, if the user is not at the top of the page
function scroll(scrollY) {
  if (scrollY > 100) {
    header.classList.add('opaque')
  } else {
    header.classList.remove('opaque')
  }
}

links.forEach((link) => {
  link.onmouseover = () => {
    linksAfter.style.width = link.offsetWidth - 2 * 16 + 'px'
    linksAfter.style.left = link.offsetLeft + link.offsetWidth / 2 + 'px'
  }
})
links[0].parentNode.onmouseleave = () => {
  let current = linksAfter.parentNode.querySelector('.current')
  if (current) {
    linksAfter.style.width = current.offsetWidth - 2 * 16 + 'px'
    linksAfter.style.left = current.offsetLeft + current.offsetWidth / 2 + 'px'
  } else {
    linksAfter.style.width = '0'
  }
}
