//Request Fullscreen
document.addEventListener('DOMContentLoaded', () => {
    // Function to request fullscreen
    function requestFullscreen() {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    }
  
    // Add event listener for the first user click
    window.addEventListener('click', function handleFirstClick() {
      requestFullscreen();
      // Remove the event listener after the first click
      
      window.removeEventListener('click', handleFirstClick);
      
    });
  });

//terminal styles
const terminalStyle = 'font-family: Comic Sans MS; font-size: 14px'
const bigConsole = 'font-family: Comic Sans MS; font-size: 2em;color:red;'
const verdant = "font-family: Comic Sans MS; background-color: #182D09; color: #e4ecde; font-size: 2em"

//define slots 
let slot = [];

for (let i = 1; i <= 6; i++) {
  slot.push({
      url: "",
      bag: [],
      currentBank: 0,
      focus: false,
      folderIndex: 0,
      active: false,
      speedIndex: 0,
      blendIndex: 0,
      currentTime: 0,
      currentSpeed: 1,
      duration: 0
  });
}

//define global variables
var images = []
var videos = []
var audio = []
var shapes = []
var media = []
var bags = []


let popupWindow = null;

const blendModes = [
  "diff",
  "mult",
  "blend",
  "modulate",
  "add",
  "mask"
]

const speed = [
  .25,
  .5,
  1,
  2,
  4,
  8
]

//text state variables
var currentText = 0
var textStates = [];
var currentIndex = 0
var vibes =["default","machinima","green","dense","diagram","water","text","warehouse","silent hill"]




//helper functions
  function incrementVariable(count,array) {
    return (count+1) % array.length
  }

  function decrementVariable(count,array) {
    return (count - 1 + array.length) % array.length;
  }

  function randomVariable(count,array) {
    let counter = Math.floor(Math.random() * array.length)
    return counter
  } 

  function getRandomSpeed(media) {
    let speeds = [.2,.25,.5,.75,1,2]
    let randSlotSpeed = Math.floor(Math.random() * speeds.length)
    media.playbackRate = speeds[randSlotSpeed]
  }

  //Kiosk Functions (dwell, next, blend, time)
  var dwell = false 
  var start = false
  function autoNext(interval) {
    setInterval(() => {
      if (dwell === false) {
      currentIndex = (currentIndex + 1) % textStates.length;
      currentText = textStates[currentIndex].text;
      sendTextToPopup(currentText);
      textStates[currentIndex].performAction();
      console.error(currentText);
      } else {
        console.log("we are staying here for a moment. you can change things, but there is no going back.");
      }
    }, interval);
  }

  function next() {
    if (start === false) {
        autoNext(11111)
        start = true
        return start
    } else {
    currentIndex = (currentIndex + 1) % textStates.length;
    currentText = textStates[currentIndex].text;
    sendTextToPopup(currentText);
    textStates[currentIndex].performAction();
    console.error(currentText);
    dwell = false 
    console.error("%cyou cant go back again",bigConsole)
    return dwell
    }
  }

  function randTime() {
    dwell = false
    let randomSlot = Math.floor(Math.random() * 5) 
    if(slot[randomSlot].duration === undefined) {
        console.error("that didn't do anything.....")
    } else {
        console.log("oh, I think that did something.")
    }
        
    for (let i = 0; i < 5; i++) {
        if (i === randomSlot) {
            slot[0].duration = s0.src.duration
            slot[1].duration  = s1.src.duration 
            slot[2].duration  = s2.src.duration
            slot[3].duration  = audioA.duration
            slot[4].duration  = audioB.duration
            
            slot[i].currentTime = Math.floor(Math.random() * (slot[i].duration - 0.5) + 0.5)
            
            if(i ===0 ){
            s0.src.currentTime = slot[0].currentTime
            } else if(i === 1) {
            s1.src.currentTime = slot[1].currentTime
            } else if(i === 2) {
            s2.src.currentTime = slot[2].currentTime
            } else if(i === 3) {
            audioA.currentTime = slot[3].currentTime
            } else if(i === 4) {
            audioB.currentTime = slot[4].currentTime    
            } else {
            }

            console.log(slot[i].currentTime)
        }
    }
  }

  function randomBlend() {
    //dwell = false
    let randSlotBlend = Math.floor(Math.random() * 3)
    if(randSlotBlend != 0) {
    slot[randSlotBlend].blendIndex = randomVariable(slot[randSlotBlend].blendIndex, blendModes);
    // console.log(blendModes[slot[randSlotBlend].blendIndex]);
    reloadPatch()
    } else {
      
    }
  }

//load media
  function loadVideo(videoSlot, video, operation) {
    if (operation === 'increment'){
      videoSlot.folderIndex = incrementVariable(videoSlot.folderIndex,videos)
    } else if (operation === 'decrement') {
      videoSlot.folderIndex = decrementVariable(videoSlot.folderIndex,videos)
    } else if (operation === 'random') {
      videoSlot.folderIndex = randomVariable(videoSlot.folderIndex,videos)
    }
    video.src = videos[videoSlot.folderIndex]
    if (videoSlot === slot[0]) {
      slot[0].url = videos[slot[0].folderIndex]
      s0.init({src: video});
    } else if (videoSlot === slot[1]) {  
      s1.init({src: video});
      slot[1].url = videos[slot[1].folderIndex]
    } else if (videoSlot === slot[2]) {
      slot[2].url = videos[slot[2].folderIndex]
      s2.init({src: video});
    }
    videoSlot.active = true
    video.muted = false
    video.play()
  // console.log(videoSlot); // Log video filename
    //reloadPatch()
  }

  function loadImage(imageSlot, image, operation) {
    if (operation === 'increment'){ 
      imageSlot.folderIndex = incrementVariable(imageSlot.folderIndex, images);
    } else if (operation === 'decrement') {
      imageSlot.folderIndex = decrementVariable(imageSlot.folderIndex, images);
    } else if (operation === 'random') {
      imageSlot.folderIndex = randomVariable(imageSlot.folderIndex, images);
    }
    
    // Pause and cleanup video if it exists in this slot
    const videos = [videoA, videoB, videoC];
    const slotIndex = slot.indexOf(imageSlot);
    if (slotIndex !== -1 && videos[slotIndex]) {
      const video = videos[slotIndex];
      video.pause();
      video.muted = true;
    }

    image.src = images[imageSlot.folderIndex];

    if (imageSlot === slot[0]) {
      slot[0].url = images[slot[0].folderIndex];
      slot[0].duration = null;
      s0.init({ src: image });
    } else if (imageSlot === slot[1]) {
      slot[1].duration = null;
      slot[1].url = images[slot[1].folderIndex];
      s1.init({ src: image });
    } else if (imageSlot === slot[2]) {
      slot[2].duration = null;
      slot[2].url = images[slot[2].folderIndex];
      s2.init({ src: image });
    }
    imageSlot.active = true;
    //console.log(imageSlot); // Log image filename

    //reloadPatch()
  }

  function loadAudio(audioSlot, audioElement, operation) {
    if(operation === 'increment') {
      audioSlot.folderIndex = incrementVariable(audioSlot.folderIndex,audio)
    } else if (operation === 'decrement') {
      audioSlot.folderIndex = decrementVariable(audioSlot.folderIndex,audio)
    } else if (operation === 'random') {
      audioSlot.folderIndex = randomVariable(audioSlot.folderIndex,audio)
    }
    audioElement.src = audio[audioSlot.folderIndex]
    if(audioSlot === slot[3]) {
      slot[3].url = audio[slot[3].folderIndex]
      audioA.src = audio[audioSlot.folderIndex]
    } else if (audioSlot === slot[4]) {
      slot[4].url = audio[slot[4].folderIndex]
      audioB.src = audio[audioSlot.folderIndex]
    }

    audioSlot.url = audio[audioSlot.folderIndex]
    audioElement.play()
    //console.log("audio slot:",audioSlot)
  }
  // function loadModel(operation) {
  //   if(operation === 'increment') {
  //     slot[5].folderIndex = incrementVariable(slot[5].folderIndex,shapes)
  //   } else if (operation === 'decrement') {
  //     slot[5].folderIndex = decrementVariable(slot[5].folderIndex,shapes)
  //   } else if (operation === 'random') {
  //     slot[5].folderIndex = randomVariable(slot[5].folderIndex,shapes)
  //   }
  //   slot[5].url = shapes[slot[5].folderIndex] 
  //   modelViewer.src = shapes[slot[5].folderIndex] 
  // }

  // function toggleModelVisibility() {
  //   if (modelViewer.style.display === 'none') {
  //     modelViewer.style.display = 'block';
  //   } else {
  //     modelViewer.style.display = 'none';
  //   }
  // }

  const memoryMonitor = setInterval(() => {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
        console.log(`Memory limit: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`);
    }
  }, 60000);

  // Cleanup on page unload
  window.addEventListener('unload', () => {
      clearInterval(memoryMonitor);
  });

  function getMediaType(url) {
    // Early return if no URL
    if (!url) {
        console.warn('No URL provided to getMediaType');
        return 'unknown';
    }

    // Get extension from URL
    const extension = url.split('.').pop().toLowerCase();
    
    // console.log('Checking media type for:', {
    //     url,
    //     extension
    // });

    // Define valid extensions
    const mediaTypes = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        video: ['mp4', 'webm', 'mov', 'avi'],
        audio: ['mp3', 'wav', 'ogg', 'aac'],
        shape: ['glb', 'gltf', 'obj']
    };

    // Check extension against types
    for (const [type, extensions] of Object.entries(mediaTypes)) {
        if (extensions.includes(extension)) {
            //console.log(`Found media type: ${type} for extension: ${extension}`);
            return type;
        }
    }

    console.warn(`Unknown extension: ${extension} for URL: ${url}`);
    return 'unknown';
  } 

  function cleanHtmlText(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function autoBag(operation, keyword) {
    const autoBagOutput = new Bag(`${operation}-${keyword}`, keyword);
    
    // Define filter functions
    const filters = {
        type: (item) => {
            //console.log('Checking type:', item.type, 'against keyword:', keyword);
            return item.type?.toLowerCase().includes(keyword.toLowerCase());
        },
        folder: (item) => {
            // Split full path into folders
            const folders = item.url.split('/')
                .filter(segment => segment) // Remove empty segments
                .map(segment => segment.toLowerCase());
            
            //console.log('Checking folders:', folders, 'against keyword:', keyword.toLowerCase());
            
            // Check if any folder in path matches keyword
            return folders.some(folder => 
                folder.includes(keyword.toLowerCase())
            );
        },
        filename: (item) => {
            //console.log('Checking filename:', item.url?.toLowerCase(), 'against keyword:', keyword.toLowerCase());
            return item.url?.toLowerCase().includes(keyword.toLowerCase());
        },
        random: (types) => {
            // Convert string input to array if needed
            const mediaTypes = Array.isArray(types) ? types : [types];
            
            // Filter media by specified types
            const filteredMedia = media.filter(m => 
                mediaTypes.includes(m.type)
            );
  
            // Create random selection
            const output = [];
            const usedIndices = new Set();
            
            // Fill output array with random items
            while (output.length < 111 && output.length < filteredMedia.length) {
                const randomIndex = Math.floor(Math.random() * filteredMedia.length);
                
                if (!usedIndices.has(randomIndex)) {
                    usedIndices.add(randomIndex);
                    output.push(filteredMedia[randomIndex]);
                }
            }
            
            console.log(`Created random buffer with types: ${mediaTypes.join(', ')}`);
            return output;
        }
        
    };
  
    // Get filtered media array - handle random case separately
    const filteredMedia = operation === 'random' ? 
        filters.random(keyword) : 
        media.filter(filters[operation]);
    
    // Add filtered items to bag
    filteredMedia.forEach(item => {
        autoBagOutput.bag.push(item.url);
        autoBagOutput.addVibe(keyword);
        autoBagOutput.rename(keyword)
    });
        
    bags.push(autoBagOutput);
    currentBag = bags.length;
    
    return autoBagOutput;
  }
  
  async function loadMedia(slot) {
    const mediaType = this.getMediaType(slot.url);
        
    if (mediaType === 'video') {
      const video = [videoA, videoB, videoC][i];
      if (video && i < 3) {
        if (video.src !== savedSlot.url) {
          video.src = slot.url;
          video.currentTime = slot.currentTime || 0;
          video.playbackRate = slot.currentSpeed || 1;
          video.muted = false;
          try {
            await video.play();
          } catch (error) {
            console.warn('Video play interrupted:', error);
          }
        } else {
          video.currentTime = slot.currentTime || 0;
          video.playbackRate = slot.currentSpeed || 1;
          video.muted = false;
          try {
            await video.play();
          } catch (error) {
            console.warn('Video play interrupted:', error);
          }
        }
      }
    } 
    else if (mediaType === 'audio' && i >= 3 && i <= 4) {
      const audio = i === 3 ? audioA : audioB;
      if (audio.src !== savedSlot.url) {
        audio.src = savedSlot.url;
        audio.currentTime = savedSlot.currentTime || 0;
        audio.playbackRate = savedSlot.currentSpeed || 1;
        try {
          await audio.play();
        } catch (error) {
          console.warn('Audio play interrupted:', error);
        }
      } else {
        audio.currentTime = savedSlot.currentTime || 0;
        audio.playbackRate = savedSlot.currentSpeed || 1;
        try {
          await audio.play();
        } catch (error) {
          console.warn('Audio play interrupted:', error);
        }
      }
    }
    else if (mediaType === 'image' && i < 3) {
      const image = [imageA, imageB, imageC][i];
      if (image.src !== savedSlot.url) {
        image.src = savedSlot.url;
        // Mute and pause the corresponding video buffer
        const video = [videoA, videoB, videoC][i];
        if (video) {
          video.pause();
          video.muted = true;
        }
      }
    } else if(mediaType === 'unknown') {
      //slot[i].active = false;
      console.log("cum")
    }
  
  
  // Update hydra sources
  [s0, s1, s2].forEach((source, i) => {
    const element = this.getMediaType(savedState.slots[i].url) === 'video' ? 
      [videoA, videoB, videoC][i] : 
      [imageA, imageB, imageC][i];
    source.init({ src: element });
  });
  reloadPatch();
  console.log("Loaded state:", savedState);
  }
  
  function initializeTextStates() {
    paragraphArray.forEach(p => {
      const cleanedText = cleanHtmlText(p.innerHTML);
      // Only add non-empty text to states
      if (cleanedText.trim()) {
        textStates.push(new TextState(cleanedText));
      }
    });
  
    // Initialize currentText with first paragraph if exists
    if (textStates.length > 0) {
      currentText = textStates[0].text;
      currentIndex = 0;
    }
  
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Enter':
          textStates[currentIndex].setAction('save');
          textStates[currentIndex].performAction();
          textStates[currentIndex].setAction('load');
          break;
          
        // case '':
        //   textStates[currentIndex].setAction('randomize');
        //   textStates[currentIndex].performAction();
        //   break;
          
        case 'ArrowRight':
          // Advance to next text state
          currentIndex = (currentIndex + 1) % textStates.length;
          currentText = textStates[currentIndex].text;
          sendTextToPopup(currentText)
          
          // Perform action and send text
          textStates[currentIndex].performAction();
          //textStates[currentIndex].sendText();
          console.error(currentText);
          break;
  
          case 'ArrowLeft':
          // Advance to previous text state
          currentIndex = (currentIndex - 1 + textStates.length) % textStates.length;
          currentText = textStates[currentIndex].text;
          sendTextToPopup(currentText)
          // Perform action and send text
          textStates[currentIndex].performAction();
          //textStates[currentIndex].sendText();
          //console.log("Advanced to text state:", currentIndex);
          console.warn(currentText)
          break;
  
      }
    });
      setInterval(TextState.autoSaveStates,  3600000)
    return textStates;
  }

  function triggerRandomFunction(interval) {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadRandomFunctions.length);
      loadRandomFunctions[randomIndex]();
    }, interval);
  }
  
//shitpost
  var paragraphArray = []
  var shitPosts = ["WE SPEAK IN ORDER TO RATIFY EXCHANGES MADE WHILE DREAMING",
    "THE DICKSUCKING FACTORY CLOSED DOWN SO I HAD TO GO WORK AT THE MINDFUCKING CENTER",
    "LAST NIGHT I DREAMED BITCOIN WENT TO ZERO",
    "MAKING OUT ON THE STEPS OF THE BK MUSEUM WHILE ABOVE US SOME TEENAGERS CALL US F*GGOTS AND BELOW A GIRL IS READING DAVID WOJNAROWICZ EY I LOVE DAT FREAKIN MEMORY",
    "dont ask me where I got these ontologies",
    "you do not want to know",
    "DREAMS TRAIN US FOR THE TEMPORAL DISCONTINUITY OF FILMS",
    "I AM BACK IN THE PROCESS OF DOCUMENTING BECAUSE I SENSE THE PRESENCE OF MIRACLES",
    "NOT HUMAN DEFINITELY BEING",
    "GIVING MY FERAL PRIVATE EQUITY BOYFRIEND A LICK PAD OF FOIE GRAS",
    "INSECURE SOCKET LAYER",
    "TO ALL THE ELECTRONS I EVER INCONVENIENCED",
    "THIS STARTUP IS ENDING CAPITALISM",
    "I DREAMED SO SLEEPLESSLY",
    "WHAT THE FUCK IS DOMICILIATION, DO YOU MEAN HOME-MAKING?",
    "TIRED: KINGMAKING",
    "WIRED: KINMAKING",
    "MY FIRST MEMORY WAS A BARDO DREAM",
    "OUR DREAMS ARE STRIPED ACROSS THE SAME RAID ARRAY",
    "GOING ON THE COMPUTER TO MAKE PICTURES ABOUT GOING ON THE COMPUTER",
    "TURING COMPLETE GIRLFRIEND",
    "BRB MY PHONES GONNA CRY",
    "CROSS INTO FANTASY",
    "ETERNAL SUNSET OF THE SPOTLESS TECHNOLOGY",
    "I REMEMBER THE THOUGHTS BUT NOT WHETHER I CHOSE TO SPEAK THEM. DID THEY CROSS INTO YOUR AWARENESS?",
    "AN IBM CUSTOM HYBRID CLOUD PLATFORM SOLUTION BURIED UNDER 18 INCHES OF WET SILT",
    "GO HYDRA MODE WITH REAL TIME IOT BIG DATA CLUSTER ANALYTICS PIPELINES. INVISIBLE, UNKILLABLE, UNCOUNTABLE.",
    "YOU ARE IMMUNE TO PROPAGANDA",
    "ONE DAY YOU LOGGED ON AND NEVER LOGGED OFF",
    "THE BRAIN IS NOT A COMPUTER IT IS A TYPE OF MEAT!!!",
    "THE ORIGINAL MEANING OF THE ABBREVIATION LOL IS LITTLE OLD LADY FUCKING LOOK IT UP.",
    "CULTIVATING A SPACE OF NOT KNOWING",
    "DO NOT, MY FRIENDS, PROFANE THE DREAM WITH A NAME, LEST IT DEVOLVE INTO FANTASY",
    "TO DREAM, PERCHANCE TO SLEEP",
    "THE POLITICAL ECONOMY OF DREAMS IS SUBJECTIVE AND CONTINGENT",
    "TWO tokens that are TRULY nonfungible are of GRATITUDE and FRIENDSHIP",
    "THE DREAM IS THE ULTIMATE FREE MARKETPLACE OF IDEAS",
    "YOU HAVE YET ONCE MORE MISTAKEN A DREAM FOR A PROMISE",
    "THE CLOUD IS A TYPE OF RAILROAD",
    "I HAVE BEEN HERE BEFORE",
    "I AM SEEING THIS FOR THE FIRST TIME",
    "MY FIRST WORD WAS ELLIPSES;",
    "DONT COME IN I'M PROBLEMATIZING EXISTING ONTOLOGIES",
    "GETTING CYBERBULLIED BY GHOSTS",
    "THINKING OF GOEING ON THE COMPUTQR",
    "CAPITALISM CREATES PERVERSE INCENTIVES. PERVERSE INCENTIVES CREATE PERVERTS.&amp;nbsp;",
    "WHEN THE WALLED GARDEN LOOKS LIKE A FACTORY FARM",
    "WHEN THE VAPORWARE SMELLS LIKE FARTS",
    "CRAZY NIGHT I DRANK 1/5 OF A WHITE MONSTER AND LAY IN MY BED LOOKING AT THE MOON AND ASKING BOYS ON GRINDR THEIR FAVORITE WEBSITE",
    "HOW CAN YOU CLAIM TO DIY WHEN THERE IS NO SELF",
    "A FEDEX SEMI TRUCK FELL OUT OF THE SKY CRUMPLING ON IMPACT PERFECTLY CENTERED ON THE PRIVACY HEDGES IN MY PARENTS BACK YARD, INJURING NO ONE. I FELT ECSTATIC BLISS",
    "I AM AWARE OF THE CONCEPT OF AWARENESS",
    "IF MY SHOES WERENT 35 POUNDS EACH, I WOULD BLOW AWAY",
    "I DIDNT COME HERE TO WIN I CAME HERE TO MAKE FRIENDS",
    "IN THIS CONSUMER PRODUCT ARE THE SEEDS OF YOUR LIBERATION",
    "TRANS WOMEN ARE WOMEN, INFORMATION ARCHITECTURE IS ARCHITECTURE; 'IT JUST MAKE SENSE'"
  ]

  function shitPost() {
      console.error(`%c${shitPosts[Math.floor(Math.random() * shitPosts.length)]}`, bigConsole);
  }

//set up popup window
  function openTextPopup() {
    if (popupWindow == null || popupWindow.closed) {
      popupWindow = window.open('text-window.html', 'popup', 'width=600,height=400');
      popupWindow.onload = function() {
        // Send initial text once popup is loaded
        sendTextToPopup(textStates[0].text);
      };
    } else {
      popupWindow.focus();
    }
  }

// Update sendTextToPopup to use cleaned text
  function sendTextToPopup(text) {
    if (popupWindow) {
      popupWindow.postMessage({ 
        action: 'updateText', 
        text: cleanHtmlText(text)
      }, window.location.origin);
    }
  }

// Initialize popup when document loads
  document.addEventListener('DOMContentLoaded', () => {
    openTextPopup();
  });

//setup onscreen terminal evaluation
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  let inputActive = false;
  let inputText = '';

// Show input on Tab key press
  window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
          e.preventDefault();
          inputActive = !inputActive;
          if (!inputActive) {
              clearCanvas(); // Clear the canvas when toggling input mode
          }
      } else if (inputActive && e.key.length === 1) {
          inputText += e.key;
          drawTextOnCanvas(inputText);
      } else if (inputActive && e.key === 'Backspace') {
          inputText = inputText.slice(0, -1);
          drawTextOnCanvas(inputText);
      } else if (inputActive && e.key === 'Enter') {
          inputActive = false;
          clearCanvas(); // Clear the canvas after executing
          executeInput(inputText);
          inputText = ''; // Clear the input text after executing
      }
  });

// Draw text on canvas
  function drawTextOnCanvas(text) {
      clearCanvas(); // Clear previous text
      ctx.font = '48px Comic Sans MS';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

// Clear the canvas
  function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

// Execute the input text as JavaScript code
  function executeInput(input) {
      try {
          eval(input);
      } catch (error) {
          console.error('Error executing input:', error);
      }
  }

//load libraries
  async function load_library(jsonFilePath) {
    try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();

        jsonData.forEach(path => {
            const formattedPath = path.replace(/\\/g, '/');
            const extension = formattedPath.split('.').pop().toLowerCase();
            
            // Create Media object with explicit type
            const mediaObj = {
                url: formattedPath,
                type: getMediaType(extension)
            };

            // Add to media array and type-specific arrays
            media.push(mediaObj);
            
            switch(mediaObj.type) {
                case 'image':
                    images.push(formattedPath);
                    break;
                case 'video':
                    videos.push(formattedPath);
                    break;
                case 'audio':
                    audio.push(formattedPath);
                    break;
                case 'shape':
                    shapes.push(formattedPath);
                    break;
            }
        });

        console.log("Library loaded:", {
            total: media.length,
            images: images.length,
            videos: videos.length,
            audio: audio.length,
            shapes: shapes.length
        });

    } catch (error) {
        console.error("Failed to load library:", error);
    }
  }
    
  load_library('./library/library-folders.json')
  load_library('./library/library-field collage.json');
  load_library('./library/library-drone.json');
  load_library('./library/library-noclip.json');
  load_library('./library/library-posts.json')
  load_library('./library/library-plastic.json')
  load_library('./library/library-norns.json')
  load_library('./library/library-offchain.json')
  load_library('./library/library-avatar.json')
  load_library('./library/library-text.json')
  load_library('./library/library-portrait.json')
    
  
//create Buffers
  var videoA = document.createElement("video")
  videoA.src = videos[slot[0].folderIndex]
  videoA.muted = true
  videoA.loop = true
  videoA.play()
  slot[0].active = true


  var videoB = document.createElement("video")
  videoB.src = videos[slot[1].folderIndex]
  videoB.muted = true
  videoB.loop = true
  videoB.play()
  slot[1].active = true


  var videoC = document.createElement("video")
  videoC.src = videos[slot[2].folderIndex]
  videoC.muted = true
  videoC.loop = true
  videoC.play()
  slot[2].active = true


  var imageA = document.createElement("img")
  slot[0].folderIndex = 0
  slot[0].url = images[slot[0].folderIndex]
  imageA.src = images[slot[0].folderIndex]

  var imageB = document.createElement("img")
  slot[1].folderIndex = 5
  slot[1].url = images[slot[1].folderIndex]
  imageB.src = images[slot[1].folderIndex]

  var imageC = document.createElement("img")
  slot[2].folderIndex = 10
  slot[2].url = images[slot[2].folderIndex]
  imageC.src = images[slot[2].folderIndex]  


  var audioA = new Audio(audio[slot[3].folderIndex])
  var audioB = new Audio(audio[slot[4].folderIndex])

  // var modelViewer = document.getElementById("model")
  // modelViewer.src = shapes[slot[5].folderIndex] 

  var buffers = [videoA,videoB,videoC,imageA,imageB,imageC,audioA,audioB]
  
  
//load paragraphs from html file
  
  function loadParagraphsFromFile(filePath) {
    return fetch(filePath)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const paragraphs = doc.querySelectorAll('p');
        paragraphArray = Array.from(paragraphs);
        console.log(paragraphArray); // Do something with the array of paragraphs
      })
      .catch(error => console.error('Error loading file:', error));
  }
  loadParagraphsFromFile('dead-name-all.html').then(() => {initializeTextStates()});

const loadRandomFunctions = [loadRandomImage, randomVideoSpeed, randomBlend, shitPost, randomBlend, loadRandomImage, morphIt, loadRandomVideo, randomBlend, randomVideoTime, randomAudioSpeed, loadRandomAudio, loadRandomVideo, randomBlend];

//Define Text States
class TextState {
  constructor(text) {
    this.text = cleanHtmlText(text);
    this.state = null;
    this.currentAction = 'randomize';
    this.vibes = [] // Default action
  }

  static peekAhead(offset = 10) {
    const peekIndex = (currentIndex + offset) % textStates.length;
    return textStates[peekIndex]?.text || 'No future text';
  }

  randomize() {
    // Log the text being analyzed
    //console.warn(this.text);
    const peekIndex = (currentIndex + 10) % textStates.length; // Wrap around using modulo
    const peekText = textStates[peekIndex]?.text || 'No future text';
    console.warn(peekText)

    // Better keyword matching with arrays
    const keywords = {
        computer: ['computer', 'machine', 'cloud', 'theseus'],
        text: ['wake', 'book', 'write', 'word', 'read', 'wrote', 'poem', 'essay'],
        walking: ['walk', 'walking', 'moved', 'stroll'],
        thinking: ['i think', 'I think', 'memory', 'archive'],
        tvordis: ['tvordis', 'husband', 'dead', 'Tvordis'],
        avatar: ['avatar','npc'],
        body: ['tits','body']
    };

    // Check each keyword category
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => this.text.toLowerCase().includes(word))) {
            console.error(words);
            
            switch(category) {
                case 'computer':
                    console.warn("i will go to the world and take you home to my computer");
                    randomFromBag('folder', 'computer');
                    setTimeout(3500)
                    //break;
                case 'text':
                    console.warn("we speak aloud only to confirm what has already happened in dreams");
                    randomFromBag('folder', 'text');
                    setTimeout(3500)

                    //break;
                  case 'body':
                  console.warn("this is my body");
                  randomFromBag('folder', 'portrait');
                  setTimeout(3500)

                case 'walking':
                    console.warn("and for an instant, I clipped through him");
                    randomFromBag('folder', 'noclip');
                    setTimeout(3500)

                    //break;
                case 'thinking':
                    console.warn("i would like to show you how it feels");
                    randomFromBag('folder', 'offchain');
                    setTimeout(3500)

                    //break;
                    //break;
                case 'avatar':
                  console.warn("is your work about the body?");
                  randomFromBag('filename', 'avatar');
                  //break;
                  case 'tvordis':
                    console.warn("he is present with us as a fellow listener");
                    randomFromBag('filename', 'zoom');
                    //break;
                default:
                    // Random function if no keywords match
                    const randomIndex = Math.floor(Math.random() * loadRandomFunctions.length);
                    loadRandomFunctions[randomIndex]();
            }
            return; // Exit after first match
        }
    }

    // If no keywords matched, use random function
    // console.log("No keywords matched, using random function");
    console.warn("i forget")
    const randomIndex = Math.floor(Math.random() * loadRandomFunctions.length);
    loadRandomFunctions[randomIndex]();
}


  saveState() {
    this.state = [];
    
    // Create state object with slots and buffers
    const savedSlot = JSON.parse(JSON.stringify(slot));
    const savedBuffers = buffers.map(buffer => {
      if (buffer instanceof HTMLVideoElement || buffer instanceof HTMLAudioElement) {
        return {
          currentTime: buffer.currentTime,
          playbackRate: buffer.playbackRate,
          src: buffer.src,
          duration: buffer.duration
        };
      } else if (buffer instanceof HTMLImageElement || buffer instanceof HTMLElement) {
        return {
          src: buffer.src,
          duration: null
        };
      }
      return {};
    });

    // Save complete state
    this.state.push({
      slots: savedSlot.map((slotItem, i) => ({
        url: slotItem.url,
        bag: slotItem.bag,
        currentTime: savedBuffers[i]?.currentTime,
        currentSpeed: savedBuffers[i]?.playbackRate,
        active: slotItem.active,
        speedIndex: slotItem.speedIndex,
        blendIndex: slotItem.blendIndex,
        folderIndex: slotItem.folderIndex,
        duration: slotItem.duration
      }))
    });

    console.log("%cWitnessing leaves traces...", verdant, this.state);
  }

  async loadState() {
    if (!this.state || !this.state.length) return;
  
    const savedState = this.state[0] || {};
    
    // Clean up existing media
    [videoA, videoB, videoC].forEach(video => {
      for(let i= 0;i<3;i++){
        if(savedState.slots[i].url !== video.src){
          video.pause();
          //video.currentTime = 0;
          video.muted = true;
        }
      }
      // if(savedState.slots)
      // video.pause();
      // video.currentTime = 0;
      // video.muted = true;
    });
  
    [audioA, audioB].forEach(audio => {
      for(let i= 3;i<5;i++){
        if(savedState.slots[i].url !== audio.src){
          audio.pause();
          //audio.currentTime = 0;
        }
      }
    });

    
  
    // Load saved state for each slot
    for (const [i, savedSlot] of savedState.slots.entries()) {
      slot[i] = {...savedSlot};  // Update slot properties
  
      // Handle media elements based on type
      const mediaType = this.getMediaType(savedSlot.url);
      
      if (mediaType === 'video') {
        const video = [videoA, videoB, videoC][i];
        if (video && i < 3) {
          if (video.src !== savedSlot.url) {
            video.src = savedSlot.url;
            video.currentTime = savedSlot.currentTime || 0;
            video.playbackRate = savedSlot.currentSpeed || 1;
            video.muted = false;
            try {
              await video.play();
            } catch (error) {
              console.warn('Video play interrupted:', error);
            }
          } else {
            video.currentTime = savedSlot.currentTime || 0;
            video.playbackRate = savedSlot.currentSpeed || 1;
            video.muted = false;
            try {
              await video.play();
            } catch (error) {
              console.warn('Video play interrupted:', error);
            }
          }
        }
      } 
      else if (mediaType === 'audio' && i >= 3 && i <= 4) {
        const audio = i === 3 ? audioA : audioB;
        if (audio.src !== savedSlot.url) {
          audio.src = savedSlot.url;
          audio.currentTime = savedSlot.currentTime || 0;
          audio.playbackRate = savedSlot.currentSpeed || 1;
          try {
            await audio.play();
          } catch (error) {
            console.warn('Audio play interrupted:', error);
          }
        } else {
          audio.currentTime = savedSlot.currentTime || 0;
          audio.playbackRate = savedSlot.currentSpeed || 1;
          try {
            await audio.play();
          } catch (error) {
            console.warn('Audio play interrupted:', error);
          }
        }
      }
      else if (mediaType === 'image' && i < 3) {
        const image = [imageA, imageB, imageC][i];
        if (image.src !== savedSlot.url) {
          image.src = savedSlot.url;
          // Mute and pause the corresponding video buffer
          const video = [videoA, videoB, videoC][i];
          if (video) {
            video.pause();
            video.muted = true;
          }
        }
      } else if(mediaType === 'unknown') {
        slot[i].active = false;
      }
    }
  
    // Update hydra sources
    [s0, s1, s2].forEach((source, i) => {
      const element = this.getMediaType(savedState.slots[i].url) === 'video' ? 
        [videoA, videoB, videoC][i] : 
        [imageA, imageB, imageC][i];
      source.init({ src: element });
    });
    reloadPatch();
    console.log("Loaded state:", savedState);
  }

  getMediaType(url) {
    if (!url) return 'unknown'; // Add check for undefined or null url
    const extension = url.split('.').pop().toLowerCase();
    if(['mp4', 'mov'].includes(extension)) return 'video';
    if(['jpg', 'png'].includes(extension)) return 'image';
    if(['mp3', 'wav'].includes(extension)) return 'audio';
    return 'unknown';
  }


  sendText() {
    if (popupWindow) {
      popupWindow.postMessage({ 
        action: 'updateText', 
        text: this.text 
      }, window.location.origin);
    }
  }

  // Method to execute current action
  performAction() {
    switch(this.currentAction) {
      case 'randomize':
        this.randomize();
        break;
      case 'save':
        this.saveState();
        break;
      case 'load':
        this.loadState();
        break;
      case 'send':
        this.sendText();
        break;
    } 
  }

  // Method to change current action
  setAction(actionName) {
    if(['randomize', 'save', 'load', 'send'].includes(actionName)) {
      this.currentAction = actionName;
    }
  }
  
  static autoSaveStates() {
      // Verify textStates exists and has content
      if (!textStates || !textStates.length) {
          console.warn('No text states to save');
          return;
      }

      console.log('Your sight has been recorded', textStates.length);

      // Get all states with explicit property access
      const stateLog = textStates.map(state => {
          const stateObj = {
              text: state.text || '',
              state: state.state || {},
              currentAction: state.currentAction || null,
              vibes: state.vibes || [],
              timestamp: new Date().toISOString()
          };
          console.log('Processing...', stateObj);
          return stateObj;
      });

      try {
          // Create data string with error checking
          const dataStr = JSON.stringify(stateLog, null, 2);
          if (!dataStr || dataStr === '[]') {
              console.warn('Empty state data');
              return;
          }

          console.log('Data to save:', dataStr.substring(0, 100) + '...');

          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;

          const now = new Date();
          const dateStr = now.toISOString()
              .replace(/T/, '_')
              .replace(/:/g, '-')
              .replace(/\..+/, '');
          a.download = `State_Log_at_${dateStr}.json`;

          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          console.log(`State log saved: ${a.download}`);
      } catch (error) {
          console.error('Error saving states:', error);
      }
  }


}

//Define Bag
class Bag {
  constructor(name, vibe) {
      this.name = ""
      this.bag = [];
      this.vibe = []
      this.addVibe(vibe)
  }

  add(item) {
      if(item === undefined){
          for (let i = 0; i < slot.length; i++) {
          if (slot[i].focus) {
              item =  slot[i].url
          }
      }
      if (item &&!this.bag.includes(item)){
      this.bag.push(item);
      }
      }
      
  }

  rename(name){
      this.name = name
  }

  newBag(name,vibe) {
      this.name = name
      this.vibe = vibe
      this.bag = add()
      bags.push(this)
      currentBag = bags.length - 1
  }

  remove(item) {
      this.bag = this.bag.filter(i => i !== item);
  }

  empty() {
      this.bag = [];
  }

  getBag() {
      return this.bag;
  }

  addVibe(vibe) {
  //const vibeString = JSON.stringify(vibe);
  if (!this.vibe.includes(vibe)) {
    this.vibe.push(vibe);
  }
  if (!vibes.includes(vibe)) {
    vibes.push(vibe);
  }
  }

  loadBag(slot){
      slot.url = this.bag[0]
      slot.bag = this.bag
  }

  saveBag(){
      if(!bags){
          var bags = []
      }
      bags.push(this.bag)
      return bags
  }

  getVibes() {
      return this.vibe;
  }

  async saveBagJson() {
      const now = new Date();
      const dateStr = now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Format date and time
      const filename = `New Bag${dateStr}.json`; // Set the download filename

      const jsonContent = JSON.stringify(this.bag, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      try {
          // Create file handle
          const handle = await window.showSaveFilePicker({
              suggestedName: 'filename',
              types: [{
                  description: 'JSON File',
                  accept: {'application/json': ['.json']},
              }],
          });
          
          // Create writable stream
          const writable = await handle.createWritable();
          // Write the file
          await writable.write(blob);
          await writable.close();
          
          console.log('Bag file saved successfully');
      } catch (err) {
          console.error('Error saving bag file:', err);
      }
  }

} 
  
//window commands
window.commands = {
  bag: (operation, keyword) => {
      if (!operation || !keyword) {
          return console.error('Usage: commands.bag("type", "video")');
      }
      const newBag = autoBag(operation, keyword);
      //bags.push(newBag);
      console.log(`Created bag: ${operation}:${keyword}`, newBag);
      //return newBag;
  },

  load: (slotIndex, bagIndex) => {
      if (typeof slotIndex !== 'number' || typeof bagIndex !== 'number') {
          return console.error('Usage: commands.load(0, 1)');
      }
      if (bags[bagIndex]) {
          slot[slotIndex].bag = bags[bagIndex].bag;
          slot[slotIndex].url = bags[bagIndex].bag[0];
          // updateLayer(slotIndex);
          console.log(`Loaded bag ${bagIndex} into slot ${slotIndex}`);
      }
  },

  list: () => {
      console.table(bags.map((b, i) => ({
          index: i,
          name: b.name,
          items: b.bag.length
      })));
  },

  help: () => console.log(`
Available commands:
commands.bag("type", "video")
commands.bag("folder", "drone") 
commands.bag("random", "visual")
commands.load(0, 1)
commands.list()
  `)
};
   
//load hydra
  let hydra, hydraCanvas;
  hydraCanvas = document.createElement("canvas");
  hydraCanvas.width = window.innerWidth;
  hydraCanvas.height = window.innerHeight;
  hydraCanvas.id = "hydraCanvas";
  
  // hydra = new Hydra({
  //     canvas: hydraCanvas,
  //     detectAudio: false,
  //     enableStreamCapture: false,
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  // });

  hydraCanvas.addEventListener('webglcontextlost', function(event) {
    event.preventDefault();
    console.warn('WebGL context lost');
  }, false);
  
  hydraCanvas.addEventListener('webglcontextrestored', function() {
    console.log('WebGL context restored');
    // Reinitialize Hydra and other visual elements
    initializeHydra();
    reloadPatch();
  }, false);
  
  function initializeHydra() {
    hydra = new Hydra({
      canvas: hydraCanvas,
      detectAudio: false,
      enableStreamCapture: false,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
  
  // Call this function after creating the canvas
  initializeHydra();

  function resizeHydraPatch() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Resize Hydra canvas
    if (hydraCanvas) {
      hydraCanvas.width = width;
      hydraCanvas.height = height;
      hydra.setResolution(width, height);
    }
  }

  // Initial resize
  resizeHydraPatch();
  
  // Add event listener for window resize
  window.addEventListener('resize', resizeHydraPatch);

  function reloadPatch() {
    if (slot[0].active === true && slot[1].active === true && slot[2].active === true) {
      src(s0)[blendModes[slot[1].blendIndex]](s1)[blendModes[slot[2].blendIndex]](s2).out();
    } else if(slot[0].active === true && slot[1].active === true && slot[2].active === false) {
      src(s0)[blendModes[slot[1].blendIndex]](s1).out();
    } else if(slot[0].active === true && slot[1].active === false && slot[2].active === false) {
      src(s0).out();
    } else if(slot[0].active === true && slot[1].active === false && slot[2].active === true) {
      src(s0)[blendModes[slot[2].blendIndex]](s2).out();
    }
  }

  function hideVideo(videoSlot) {
    if(videoSlot.active === true) {
      videoSlot.active = false
    } else if(videoSlot.active === false) {
      videoSlot.active = true
    }
    reloadPatch()
  }
      
  s0.init({src:imageA})
  s1.init({src:imageB})
  s2.init({src:imageC})
  
  function getDuration() {
    slot[0].duration = s0.src.duration
    slot[1].duration  = s1.src.duration 
    slot[2].duration  = s2.src.duration
  }

  reloadPatch()

  document.body.appendChild(hydraCanvas);

  
//random mode
  
//v3 randomFromBag
  function randomFromBag(operation, keyword) {
    // Create new bag and get its index
    const newBag = autoBag(operation, keyword);
    
    if (!newBag?.bag?.length) {
        console.warn('No media found for', operation, keyword);
        return;
    }
  
    // Pick random elements
    let randElement = Math.floor(Math.random() * newBag.bag.length);
    const newUrl = newBag.bag[randElement];
    const mediaType = getMediaType(newUrl);
  
    // Handle audio separately
    if (mediaType === 'audio') {
        let audioSlot = Math.floor(Math.random() * 2) + 3;
        const audioElement = (audioSlot === 3) ? audioA : audioB;
  
        // Clean up existing audio
        if (audioElement.src) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
  
        // Load new audio
        audioElement.src = newUrl;
        audioElement.muted = false;
        
        // Update slot properties
        slot[audioSlot].url = newUrl;
        slot[audioSlot].folderIndex = randElement;
        slot[audioSlot].active = true;
  
        // Play with user interaction check
        const playAudio = async () => {
            try {
                await audioElement.play();
                console.log("only one person can listen at a time. describe what you're hearing to your neighbor:", newUrl);
            } catch (e) {
                console.warn('%cCHANGE', bigConsole);
                // Retry on user interaction
                document.addEventListener('keydown', async (event) => {
                    if (event.code === 'KeyS' || 'KeyA' || 'KeyD') {
                        try {
                            await audioElement.play();
                        } catch (err) {
                            console.warn('Audio retry failed:', err);
                        }
                    }
                }, { once: true });
            }
        };
        
        playAudio();
        return;
    }
  
    // Handle visual media
    let randSlot = Math.floor(Math.random() * 3);
    const videos = [videoA, videoB, videoC];
    const images = [imageA, imageB, imageC];
    const sources = [s0, s1, s2];
  
    // Clean up existing media
    const cleanupMedia = async () => {
        if (videos[randSlot]) {
            videos[randSlot].pause();
            videos[randSlot].currentTime = 0;
            videos[randSlot].muted = true;
        }
        if (images[randSlot]) {
            images[randSlot].src = '';
        }
    };
  
    // Load new media
    const loadMedia = async () => {
        await cleanupMedia();
  
        // Update slot properties
        slot[randSlot].url = newUrl;
        slot[randSlot].folderIndex = randElement;
        slot[randSlot].active = true;
  
        if (mediaType === 'video') {
            const video = videos[randSlot];
            video.src = newUrl;
            video.muted = false;
            
            // Play with user interaction check
            const playVideo = async () => {
                try {
                    await video.play();
                    console.log('Something new...', newUrl);
                } catch (e) {
                    console.warn('Video play failed:', e);
                    // Retry on user interaction
                    document.addEventListener('keydown', async (event) => {
                        if (event.code === 'KeyA' || 'KeyS' || 'KeyD') {
                            try {
                                await video.play();
                            } catch (err) {
                                console.warn('Video retry failed:', err);
                            }
                        }
                    }, { once: true });
                }
            };
  
            await playVideo();
            sources[randSlot].init({ src: video });
        } else if (mediaType === 'image') {
            images[randSlot].src = newUrl;
            sources[randSlot].init({ src: images[randSlot] });
        }
  
        console.error('this is what i have for you', {
            slotIndex: randSlot,
            url: newUrl,
            mediaType,
            active: true
        });
  
        reloadPatch();
    };
  
    loadMedia();
  }
  

  function loadRandomVideo() {
    let randomSlotVid = Math.floor(Math.random() * 3)
    if (randomSlotVid === 0) {
      loadVideo(slot[randomSlotVid], videoA, 'random');
    } else if (randomSlotVid === 1) {
      loadVideo(slot[randomSlotVid], videoB, 'random');
    } else if (randomSlotVid === 2) { 
      loadVideo(slot[randomSlotVid], videoC, 'random');
  
    }
    //console.log('random video in slot',(randomSlotVid + 1), slot[randomSlotVid].url);
  } 

  function loadRandomImage() {
    let randSlotImg = Math.floor(Math.random() * 3); // Actually generate random slot
    const videos = [videoA, videoB, videoC];
    const images = [imageA, imageB, imageC];
  
    // Pause and cleanup video if it exists in this slot
    if (slot[randSlotImg].url === videos[randSlotImg].src) {
      videos[randSlotImg].pause();
//        videos[randSlotImg].currentTime = 0;
      videos[randSlotImg].muted = true;
    }
  
    // Load image into slot
    if (randSlotImg === 0) {
      loadImage(slot[randSlotImg], imageA, 'random');
    } else if (randSlotImg === 1) {
      loadImage(slot[randSlotImg], imageB, 'random');
    } else if (randSlotImg === 2) {
      loadImage(slot[randSlotImg], imageC, 'random');
    }
  
    // console.log('random image in slot', (randSlotImg + 1), slot[randSlotImg].url);
  }
  
  function loadRandomAudio() {
    let randSlotAud = Math.floor(Math.random() * 2);
    if (randSlotAud === 0) {
      loadAudio(slot[3], audioA, 'random');
      audioA.addEventListener('loadedmetadata', () => {
        audioA.currentTime = Math.random() * (audioA.duration - 0.5) + 0.5;
        //getRandomSpeed(audioA);
      }, { once: true });
    } else if (randSlotAud === 1) {
      loadAudio(slot[4], audioB, 'random');
      audioB.addEventListener('loadedmetadata', () => {
        audioB.currentTime = Math.random() * (audioB.duration - 0.5) + 0.5;
  
        //getRandomSpeed(audioB);
      }, { once: true });
    }
   // console.log('random audio in slot', (randSlotAud + 1), slot[randSlotAud + 3].url);
  }
  
  function morphIt() {
    let morphSlot = Math.floor(Math.random() * 3)
    if (morphSlot === 0) {
    } else if (morphSlot === 1) {
      slot[1].blendIndex = 4
    } else if (morphSlot === 2) { 
      slot[2].blendIndex = 4
    }
    reloadPatch()
    //console.log('its morphing time baby');
  }
  
  function randomAudioSpeed() {
    let randSlotAud = Math.floor(Math.random() * 2);
    if (randSlotAud === 0) {
      if(slot[3].duration !== null && slot[3].active === true) {
      getRandomSpeed(audioA);
      //console.log('random audio speed in slot', (randSlotAud + 1));
      }
    } else if (randSlotAud === 1) {
      if(slot[4].duration !== null && slot[4].active === true) {
      getRandomSpeed(audioB);
      //console.log('random audio speed in slot', (randSlotAud + 1));
      }
    } else {
      console.warn('i am really trying to be brave and put on a brave face but i am not sure what to do');
    }
    
  }
  
  function randomVideoSpeed() {
    let randSlotVid = Math.floor(Math.random() * 3);
    if(slot[randSlotVid].duration !== null) {
      if (randSlotVid === 0) {
        getRandomSpeed(videoA);
      } else if (randSlotVid === 1) {
        getRandomSpeed(videoB);
      } else if (randSlotVid === 2) {
        getRandomSpeed(videoC);
      }
    } else {
      morphIt()
    } 
    //console.log('random speed in slot', (randSlotVid + 1));
  }
  
  function randomVideoTime() {
    // Create array of video elements and their indices
    const videoSlots = [
      { element: videoA, index: 0 },
      { element: videoB, index: 1 },
      { element: videoC, index: 2 }
    ].filter(slot => {
      // Filter for video elements that have duration (are actually videos)
      return slot.element.duration && slot.element.duration > 0;
    });
  
    if (videoSlots.length === 0) {
      //console.log('No video slots available, trying different random function');
      // Filter out randomVideoTime from available functions
      const otherFunctions = loadRandomFunctions.filter(fn => fn !== randomVideoTime ); // Pick random alternative function
      const randomFunction = otherFunctions[Math.floor(Math.random() * otherFunctions.length)];
      randomFunction();
      return;
    }
  
    // Pick random slot from available videos
    const randomSlot = videoSlots[Math.floor(Math.random() * videoSlots.length)];
    
    try {
      randomSlot.element.currentTime = Math.random() * (randomSlot.element.duration - 0.5) + 0.5;
      console.log('are you seeing things a bit differently?');
    } catch(err) {
      console.warn('Failed to set video time:', err);
    }
  }
  
  
  
  
  
//v2 randomFromBag
  // function randomFromBag(operation, keyword) {
  //   // Create new bag and get its index
  //   const newBag = autoBag(operation, keyword);
    
  //   // Verify bag exists and has content
  //   if (!newBag?.bag?.length) {
  //       console.warn('No media found for', operation, keyword);
  //       return;
  //   }
  
  //   // Pick random slot and element
  //   let randSlot = Math.floor(Math.random() * 3);
  //   let randElement = Math.floor(Math.random() * newBag.bag.length);
  //   const newUrl = newBag.bag[randElement];
    
  //   // Get media type first
  //   const mediaType = getMediaType(newUrl);
  
  //   if (mediaType === 'audio') {
  //     // Pick random audio slot (3 or 4)
  //     let audioSlot = Math.floor(Math.random() * 2) + 3;
  //     const audioElement = (audioSlot === 3) ? audioA : audioB;
  
  //     // Update slot properties
  //     slot[audioSlot].url = newUrl;
  //     slot[audioSlot].folderIndex = randElement;
  //     slot[audioSlot].active = true;
  
  //     // Load audio
  //     audioElement.src = newUrl;
  //     audioElement.play()
  //         .catch(e => console.warn('Audio play failed:', e));
  
  //     console.error("only one can listen at a time. describe what you're hearing.", {
  //         slotIndex: audioSlot,
  //         url: newUrl,
  //         active: true
  //     });
  //     return;
  //   }
    
  //   // Update slot properties
  //   slot[randSlot].url = newUrl;
  //   slot[randSlot].folderIndex = randElement;
  //   slot[randSlot].active = true;
    
  //   // Get buffer arrays
  //   const videos = [videoA, videoB, videoC];
  //   const images = [imageA, imageB, imageC];
  //   const sources = [s0, s1, s2];
  
  //   // Clear existing media in slot
  //   if (videos[randSlot]) {
  //       videos[randSlot].pause();
  //       videos[randSlot].muted = true;
  //   }
  //   if (images[randSlot]) {
  //       images[randSlot].src = '';
  //   }
    
  //   // Load new media
  //   if (mediaType === 'video') {
  //       videos[randSlot].src = newUrl;
  //       videos[randSlot].muted = false;
  //       videos[randSlot].play()
  //           .catch(e => console.warn('Video play failed:', e));
  //       sources[randSlot].init({ src: videos[randSlot] });
        
  //       console.log(`Loaded video in slot ${randSlot + 1}:`, newUrl);
  //   } else if (mediaType === 'image') {
  //       images[randSlot].src = newUrl;
  //       sources[randSlot].init({ src: images[randSlot] });
        
  //       console.log(newUrl);
  
  //       //console.log(`Loaded image in slot ${randSlot + 1}:`, newUrl);
  //   }
  
  //   // Debug logging
  //   // console.log('Slot state after update:', {
  //   //     slotIndex: randSlot,
  //   //     url: slot[randSlot].url,
  //   //     mediaType,
  //   //     active: slot[randSlot].active
  //   // });
  //   console.error('this is what i have for you', {
  //         slotIndex: randSlot,
  //         url: slot[randSlot].url,
  //         mediaType,
  //         active: slot[randSlot].active
  //     });
  
  //   // Reload Hydra patch
  //   reloadPatch();
  // }
  //v1
  //     function randomFromBag(operation, keyword) {
  //     // Create new bag and get its index
  //     const newBag = autoBag(operation, keyword);
  //     const bagIndex = bags.length - 1; // Get last index since we just pushed
  
  //     // Verify bag exists and has content
  //     if (!newBag || !newBag.bag || newBag.bag.length === 0) {
  //         console.warn('No media found for', operation, keyword);
  //         return;
  //     }
  
  //     // Pick random slot and element
  //     let randSlot = Math.floor(Math.random() * 3);
  //     let randElement = Math.floor(Math.random() * newBag.bag.length);
      
  //     // Update slot properties
  //     slot[randSlot].url = newBag.bag[randElement];
  //     slot[randSlot].folderIndex = randElement;
      
  //     // Load media into appropriate buffer
  //     const mediaType = getMediaType(slot[randSlot].url);
      
  //     if (mediaType === 'video') {
  //         const videos = [videoA, videoB, videoC];
  //         if (videos[randSlot]) {
  //             videos[randSlot].src = slot[randSlot].url;
  //             videos[randSlot].play().catch(e => console.warn('Video play failed:', e));
  //         }
  //     } else if (mediaType === 'image') {
  //         const images = [imageA, imageB, imageC];
  //         if (images[randSlot]) {
  //             images[randSlot].src = slot[randSlot].url;
  //         }
  //     }
  
  //     // Update Hydra source
  //     const sources = [s0, s1, s2];
  //     if (sources[randSlot]) {
  //         const element = mediaType === 'video' ? 
  //             [videoA, videoB, videoC][randSlot] : 
  //             [imageA, imageB, imageC][randSlot];
  //         sources[randSlot].init({ src: element });
  //     }
  
  //     console.log('Random from bag in slot', (randSlot + 1), slot[randSlot].url);
      
  //     // Reload Hydra patch
  //     reloadPatch();
  // }
  
  
  //v0
      // function randomFromBag(operation, keyword) {
      //   let randSlot = Math.floor(Math.random() * 3)
      //   autoBag(operation, keyword)
      //   let tempBag = bags[bags.length]
      //   let randElement = Math.floor(Math.random() * tempBag.bag.length)
        
      //   //randIndex = randomVariable(slot[randSlot].folderIndex,randBag.bag)
      //   //slot[randSlot].bag = randBag.bag
      //   slot[randSlot].url = tempBag.bag[randElement]
      //   slot[randSlot].folderIndex = randElement
      //   for(let i = 0; i < 3; i++) { 
      //     if(i === randSlot) {
      //       loadMedia(slots[randSlot])
      //     }
      //   }
      //   console.log('random from bag in slot', (randSlot + 1), slot[randSlot].url);
      // }
  
      // function randomFromBag(operation, keyword) {
      //   autoBag(operation, keyword)
  
      //   let randSlot = Math.floor(Math.random() * 3)
      //   let randBag = bags[0].bag
      //   randIndex = randomVariable(slot[randSlot].folderIndex,randBag.bag)
      //   slot[randSlot].bag = randBag.bag
      //   slot[randSlot].url = randBag.bag[randIndex]
      //   slot[randSlot].folderIndex = randIndex
      //   for(let i = 0; i < 3; i++) { 
      //     if(i === randSlot) {
      //       loadMedia(slots[randSlot])
      //     }
      //   }
      //   console.log('random from bag in slot', (randSlot + 1), slot[randSlot].url);
      // }
  

    
  // function loadMedia(inputSlot, mediaArray, operation = 'increment') {
//   // Early return if invalid input
//   if (!slot || !mediaArray) {
//       console.warn('Invalid slot or media array');
//       return;
//   }

//   // Get slot index and validate
//   const slotIndex = slot.indexOf(inputSlot);
//   if (slotIndex === -1) {
//       console.warn('Invalid slot');
//       return;
//   }

//   // Get current index in media array
//   let currentIndex = mediaArray.indexOf(inputSlot.url)
  
//   // Update index based on operation
//   switch(operation) {
//       case 'increment':
//           currentIndex = (currentIndex + 1) % mediaArray.length;
//           break;
//       case 'decrement':
//           currentIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
//           break;
//       case 'random':
//           currentIndex = Math.floor(Math.random() * mediaArray.length);
//           break;
//       default:
//           console.warn('Invalid operation');
//           return;
//   }

//   // Get new media item
//   const newMedia = mediaArray[currentIndex];
//   const mediaType = getMediaType(newMedia.url);

//   // Get corresponding buffers for this slot
//   const buffers = {
//       video: [videoA, videoB, videoC][slotIndex],
//       image: [imageA, imageB, imageC][slotIndex],
//       audio: [audioA, audioB][slotIndex - 3], // Audio slots start at index 3
//       shape: modelViewer
//   };

//   // Update appropriate buffer based on media type
//   try {
//       switch(mediaType) {
//           case 'video':
//               if (slotIndex < 3) { // Only first 3 slots can play video
//                   const videoBuffer = buffers.video;
//                   videoBuffer.src = newMedia.url;
//                   videoBuffer.currentTime = slot.currentTime || 0;
//                   videoBuffer.playbackRate = slot.currentSpeed || 1;
//                   videoBuffer.muted = false;
//                   videoBuffer.play()
//                       .catch(error => console.warn('Video play interrupted:', error));
                  
//                   // Pause corresponding image if any
//                   if (buffers.image) {
//                       buffers.image.src = '';
//                   }
//               }
//               break;

//           case 'image':
//               if (slotIndex < 3) { // Only first 3 slots can display images
//                   const imageBuffer = buffers.image;
//                   imageBuffer.src = newMedia.url;
                  
//                   // Pause corresponding video if any
//                   if (buffers.video) {
//                       buffers.video.pause();
//                       buffers.video.muted = true;
//                   }
//               }
//               break;

//           case 'audio':
//               if (slotIndex >= 3 && slotIndex <= 4) { // Slots 3-4 are audio only
//                   const audioBuffer = buffers.audio;
//                   audioBuffer.src = newMedia.url;
//                   audioBuffer.currentTime = slot.currentTime || 0;
//                   audioBuffer.playbackRate = slot.currentSpeed || 1;
//                   audioBuffer.play()
//                       .catch(error => console.warn('Audio play interrupted:', error));
//               }
//               break;

//           case 'shape':
//               if (slotIndex === 5) { // Slot 5 is for 3D models
//                   buffers.shape.src = newMedia.url;
//               }
//               break;
//       }

//       // Update slot properties
//       inputSlot.url = newMedia.url;
//       inputSlot.active = true;

//       // Update Hydra sources if needed
//       if (slotIndex < 3) {
//           const source = [s0, s1, s2][slotIndex];
//           const element = mediaType === 'video' ? buffers.video : buffers.image;
//           source.init({ src: element });
//           reloadPatch();
//       }

//   } catch (error) {
//       console.error('Error loading media:', error);
//   }
// }