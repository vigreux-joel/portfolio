const sections = document.querySelectorAll('section');


window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  const background = document.querySelector('.background')

  background.style.backgroundPosition = `50% calc(50% + ${scrollY*0.45}px)`;
})



observer = new IntersectionObserver(function (entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      el = entry.target
      // console.log(el.id)
      setCurrentOnglet(el.id)
      //window.scrollTo(0, el.offsetTop);
      // current = window.pageYOffset
      // start = el.offsetTop
      // end = el.offsetHeight+el.offsetTop
      // if(current - start > current - end){
      //   window.scrollTo(0, start)
      // } else {
      //   window.scrollTo(0, end)
      // }
    }
  });
}, {
  threshold: [0.6]
});

sections.forEach(section => {
  observer.observe(section);
})


const links = document.querySelectorAll('header .links a');
const linksAfter = document.querySelector('header .links .after')
function setCurrentOnglet(id){
  document.location.href='#'+id

  links.forEach(link => {
    link.classList.remove('current')
  })
  current = links[0].parentNode.querySelector('a[href="#'+id+'"]')
  if (current){
    current.classList.add('current')
    linksAfter.style.width = (current.offsetWidth-2*16)+'px'
    linksAfter.style.left = (current.offsetLeft+(current.offsetWidth/2))+'px'
  } else {
    linksAfter.style.width = '0'
  }
}

