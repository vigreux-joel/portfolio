const sections = document.querySelectorAll('section');


window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  const background = document.querySelector('.background')

  console.log('test')

  background.style.backgroundPosition = `50% calc(50% + ${scrollY*0.45}px)`;
})


// observer = new IntersectionObserver(function (entries) {
//   entries.forEach(function(entry) {
//     if (entry.isIntersecting) {
//       el = entry.target
//       console.log(el)
//       //window.scrollTo(0, el.offsetTop);
//       current = window.pageYOffset
//       start = el.offsetTop
//       end = el.offsetHeight
//       if(current - start > current - end){
//         window.scrollTo(0, start)
//       } else {
//         window.scrollTo(0, end)
//       }
//     }
//   });
// }, {
//   threshold: [0.05]
// });
//
//
// sections.forEach(section => {
//   observer.observe(section);
// })




// setTimeout(()=>{
//   el = document.getElementById('intro')
//   console.log(el)
//   el.scrollIntoView({ block: 'start'});
// }, 200)
