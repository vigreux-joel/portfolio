const buttonMenu = document.getElementById('button-menu');
const header = document.querySelector('header');

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


function scroll(scrollY){
  if(scrollY > 100){
    header.classList.add('opaque')
  } else {
    header.classList.remove('opaque')
  }
}




