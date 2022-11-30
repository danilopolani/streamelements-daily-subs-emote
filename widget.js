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
    this.emote = value;
  },

  increase() {
    this.dailySubs++;
    this.loadImage();
  },
  
  loadImage() {
    const nearestRange = [...this.ranges].reverse().find((item) => this.dailySubs >= item.value);
 
    if (nearestRange) {
      this.setEmote(nearestRange.emote);
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
    result.push({
          value: parseInt(fieldData['from' + currentIndex]),
            emote: fieldData['emote' + currentIndex],
        });

        currentIndex++;
  }
  
    return result;
}
