const buttonMenu = document.getElementById('button-menu')
const header = document.querySelector('header')
const links = header.querySelectorAll('.links a')
const linksAfter = header.querySelector('.links .after')

buttonMenu.onclick = () => {
  header.classList.toggle('close')
  header.classList.toggle('open')
}

scroll(scrollY)

var scrollYOld = 0
var scrollAmount = 0
window.onscroll = () => {
  //hidden
  if(scrollY > scrollYOld && scrollY !==0){
    header.classList.add('hidden')
    scrollAmount = window.scrollY-100
  } else if (window.scrollY <= scrollAmount || scrollY ===0){
    header.classList.remove('hidden')
  }
  scrollYOld = window.scrollY

  scroll(scrollY)
}


function scroll(scrollY) {
  if (scrollY > 100) {
    header.classList.add('opaque')
  } else {
    header.classList.remove('opaque')
  }
}

links.forEach((link) => {
  link.onmouseover = () =>{
    linksAfter.style.width = (link.offsetWidth-2*16)+'px'
    linksAfter.style.left = (link.offsetLeft+(link.offsetWidth/2))+'px'
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
