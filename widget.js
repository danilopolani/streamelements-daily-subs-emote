const store = PetiteVue.reactive({
  dailySubs: 0,
  emote: null,
  ranges: [],
  
  setRanges(value) {
    this.ranges = value;
  },
  
  setSubs(value) {
    this.dailySubs = value;
    this.loadImage();
  },
  
  setEmote(value) {
    if (value === this.emote) {
      this.emote = value;
      
      return;
    }
    
    const image = document.querySelector('#emote-image');
    image.style.setProperty('--animate-duration', '0.8s');
    image.classList.add('animate__rubberBand');
    
    confettiFromElement(image);
    
    this.emote = value;
    
    image.addEventListener('animationend', () => {
      image.classList.remove('animate__rubberBand');
    });
  },
  
  increase() {
    this.dailySubs++;
    this.loadImage();
  },
  
  loadImage() {
    const nearestRange = [...this.ranges].reverse().find((item) => this.dailySubs >= item.value);
    
    if (nearestRange) {
      this.setEmote(nearestRange.emote, true);
    }
  },
});

window.addEventListener('onWidgetLoad', function (obj) {
  PetiteVue.createApp({ store }).mount();
  
  const data = obj.detail.session.data;
  const fieldData = obj.detail.fieldData;
  const startingFrom = parseInt(fieldData.startingFrom);
  const startingDailySubs = startingFrom || data['subscriber-session']['count'];
  
  store.setRanges(computeRanges(fieldData));
  store.setEmote(fieldData.defaultEmote);
  store.setSubs(startingDailySubs);
});

window.addEventListener('onEventReceived', function (obj) {
  if (obj.detail.listener === 'subscriber-latest') {
    store.increase();
  }
});

function computeRanges(fieldData) {
  let result = [];
  let currentIndex = 1;
  
  while (typeof fieldData['from' + currentIndex] !== 'undefined') {
    const fieldFrom = parseInt(fieldData['from' + currentIndex]);
    const fieldEmote = fieldData['emote' + currentIndex];
    
    const fromIsValid = !isNaN(fieldFrom) && fieldFrom > 0;
    const emoteIsValid = fieldEmote !== null && fieldEmote !== '';
    
    if (fromIsValid && emoteIsValid) {
      result.push({
        value: fieldFrom,
        emote: fieldEmote,
      });
    }
    
    currentIndex++;
  }
  
  return result;
}

function confettiFromElement(element, opts) {
  const { top, height, left, width, } = element.getBoundingClientRect();
  const x = (left + width / 2) / window.innerWidth;
  const y = (top + height / 2) / window.innerHeight;
  const origin = { x, y };
  
  confetti({
    origin,
    spread: 360,
    startVelocity: 10,
    ticks: 20,
    particleCount: 15,
    gravity: .5,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    shapes: ['circle'],
  });
}