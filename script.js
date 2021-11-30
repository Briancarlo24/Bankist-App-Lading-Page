'use strict';

// Author - Brian Carlo Birondo - From Zero to Hero Course of Jonas

///////////////////////////////////////
// Modal window
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//Modal Window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Adding smooth scroll to the 'learn more' button
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//adding smooth scroll to nav links (not efficient)
// document.querySelectorAll('.nav__link').forEach(anchor => {
//   anchor.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); // returns #section--1/2/3
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// }); // (instead use EVENT DELEGATION)

// ---------------------Using EVENT DELEGATION----------------------------
// 1. Add event listerner to common parent element
// 2. Determine what element orginated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    // console.log('contains nav__link');
    const id = e.target.getAttribute('href'); // returns #section--1/2/3
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ****************Tabbed Component*******************

/*
// This is not efficient way -- Use Event Delegation instead (Sample below)
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    console.log('Tab');
  });
});
*/

// -- Using Event Delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  // Guard Clause (return early if some conditions is matched)
  if (!clicked) return;

  //Removing active classes
  [...clicked.parentElement.children].forEach(btn => {
    if (btn !== clicked) {
      btn.classList.remove('operations__tab--active');
    }
  });

  // Active Tab
  clicked.classList.add('operations__tab--active');

  //Removing active class--Alternative
  /*
   tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
   */

  // Removing the active classes
  tabsContent.forEach(content => {
    content.classList.remove('operations__content--active');
  });
  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// console.log(clicked.dataset.tab);

// *******************Menu Fade Animation*******************

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
// nav.addEventListener('mouseover', function () {
//   handleHover(e, 0.5);
// });
// use array for multitple value inside the bind method
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// *******************Sticky Navigation*******************
/*
const initialCoords = section1.getBoundingClientRect();

// window.scroll Works but not recommended because it slows down the performance
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if (window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
// Use the code sample below instead of window.scroll
*/
// ************Sticky Navigation: Intersection Observer API*************
/* 
// Sample Code for the Intersection Observer API
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry)
     });
};
const obsOptions = {
  root: null, // viewport
  threshold: [0, 0.01], //10% of the section1
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); 
*/
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// ************************Reveal Sections*************************
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const obsOptions = {
  root: null,
  threshold: 0.15,
  // rootMargin: '-90px',
  // rootMargin: `-${navHeight}px`,
};

const sectionObserver = new IntersectionObserver(revealSection, obsOptions);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target);

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
  //classList.remove('lazy-img');
};

const imgOberver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: '+200px',
});
imgTargets.forEach(img => {
  imgOberver.observe(img);
});

// -- Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    //
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-900px)';
  // slider.style.overflow = 'visible';

  // slides.forEach(
  //   (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
  // );
  // // 0%, 100%, 200%, 300%

  const gotoSlide = function (s) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * (i - s)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    //
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    //-100%,0, 100%, 200%, 300%
    activateDots(curSlide);
  };
  //Previous slide
  const prevSlide = function () {
    //
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDots(curSlide);
  };
  const init = function () {
    gotoSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      console.log(slide);
      gotoSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

/********THIS IS MY OWN PERSONAL NOTES FOR THE LECTURES*********
 ***************************************************************
 ********************ADVANCE DOM LECTURE************************
 ***************************************************************
 ***************************************************************/

//------SELECTING, CREATING, AND DELETING ELEMENTS------

//Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

/*
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements (creating pop-up cookies)
// .insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

const header = document.querySelector('.header');

// Adds the elements as the first or last child of 'header' element
header.append(message);

header.prepend(message);
header.append(message.cloneNode(true));
header.before(message);
header.after(message);
*/

/************************************************************** 
//Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //Before remove() -- We select Parent el then removechild like this
    // message.parentElement.removeChild(message);
  });
*/

/************************************************************** 
//------STYLES, ATTRIBUTES AND CLASSES------
//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); // Only works on inline style
console.log(message.style.width); // returns 120%
//instead use this to get style
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//this is to access the HTML 'root' element
// document.documentElement.style.setProperty('--color-primary', 'lime');

//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.getAttribute('src'));
console.log(logo.className);
//non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('sample-class', 'second-class');
logo.classList.remove('sample-class', 'second-class');
logo.classList.toggle('sample-class');
logo.classList.contains('sample-class');
// Don't use
logo.className = 'sample-class';

//-----Mouseenter Event-----
const h1 = document.querySelector('h1');
const alertH1 = function () {
  alert('You hover on the heading!');
  // Removes the eventlisterner after 1 instance
  // h1.removeEventListener('mouseenter', alertH1);
};
h1.addEventListener('mouseenter', alertH1);
// removes the eventlistener after 3seconds
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
*/

//This is the old style of doing multiple events
// h1.onmouseenter = function (e) {
//   alert('Mouse has entered');
// };

//Scrolling Infos -- necessary info to get the scrolling effect
/*
btnScrollTo.addEventListener('click', function (e) {
  console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  Scrolling effect
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );

  Old school way to do smooth scrolling effect
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  Modern way to do smooth scrolling effect
  section1.scrollIntoView({ behavior: 'smooth' });
});
  */

//**************EVENT PROPAGATION -- BUBBLING AND CAPTURING*********************/

/****************************************************************
// Generating random number between min and max
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
// rgb(255,255,255)
// Generating random color using randomInt Method
const randomColor = (min, max) =>
  `rgb(${randomInt(min, max)}, ${randomInt(min, max)}, ${randomInt(min, max)})`;
// console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(0, 255);
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation -- Good for complex application but not recommended in general
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(0, 255);
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('NAV', e.target, e.currentTarget);
    console.log(e.currentTarget === this);
    console.log(e.target === this);
  },
  true
);
*/

//**************EVENT PROPAGATION -- BUBBLING AND CAPTURING*********************/
/*
adding smooth scroll to nav links (not efficient)
document.querySelectorAll('.nav__link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href'); // returns #section--1/2/3
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
  // (instead use EVENT DELEGATION)
}); 
*/
// ---------------------Using EVENT DELEGATION----------------------------
/*
1. Add event listerner to common parent element
2. Determine what element orginated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    // console.log('contains nav__link');
    e.preventDefault();
    const id = e.target.getAttribute('href'); // returns #section--1/2/3
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
*/

//****************************DOM TRAVERSING**************************/

/*
const h1 = document.querySelector('h1');

// Going downwards: child element (searcher child => grandchild => deeper)
console.log(h1.querySelectorAll('.highlight'));
h1.querySelectorAll('.highlight').forEach((item, i) => {
  item.addEventListener('click', function () {
    console.log(`Clicked Highlighted area on index: ${i}`);
  });
});
console.log(h1.childNodes); // node are: text, elements, values, etc...
console.log(h1.children); // work only for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// closest(finding parent) is the opposit of querySelectorAll(finding children)
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// To select all the siblings -- select parent first then children(siblings)
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  el.style.transition = 'all 0.3s';
  el.addEventListener('mouseover', () => {
    if (el !== h1) el.style.transform = 'scale(0.5)';
  });
});

[...h1.parentElement.children].forEach(function (el) {
  el.addEventListener('mouseout', () => {
    if (el !== h1) el.style.transform = 'scale(1)';
  });
});
*/

/*************************LIFECYCLE DOM EVENTS**************************/
/*
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
*/

/**********************DEFER AND ASYNC SCRIPT LOADING***********************/
