async function censorText(text, obsceneWordsList) {
    let censoredText = text;
    for (const obsceneWord of obsceneWordsList) {
      const regex = new RegExp(`(?<!\\w)${escapeRegExp(obsceneWord)}(?![\\w*])`, 'gi');
      censoredText = censoredText.replace(regex, '*'.repeat(obsceneWord.length));
    }
    return censoredText;
  }
  
  function isInStyleElement(node) {
    let currentNode = node.parentElement;
    while (currentNode !== null) {
      if (currentNode.nodeName === 'STYLE') {
        return true;
      }
      currentNode = currentNode.parentElement;
    }
    return false;
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  async function replaceTextContent(obsceneWordsList) {
    const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let currentNode;
  
    while ((currentNode = textWalker.nextNode())) {
      if (!isInStyleElement(currentNode)) {
        const text = currentNode.textContent.trim();
        const censoredText = await censorText(text, obsceneWordsList);
        if (text !== censoredText) {
          currentNode.textContent = censoredText;
        }
      }
    }
  }
  
  async function sendTextForProcessing(node, text) {
    const words = text.trim().split(/\s+/);
  
    const obsceneWordsList = ["anal", "anus", "areole", "arian", "arrse", "arse", "arsehole", "asanchez", "ass", "assbang", "assbanged", "asses", "assfuck", "assfucker", "assfukka", "asshole", "assmunch", "asswhole", "autoerotic", "ballsack", "bastard", "bdsm", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bimbo", "bimbos", "bitch", "bitches", "bitchin", "bitching", "blowjob", "blowjobs", "blue waffle", "bondage", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "booty call", "breasts", "brown shower", "brown showers", "buceta", "bukake", "bukkake", "bullshit", "busty", "butthole", "carpet muncher", "cawk", "chink", "cipa", "clit", "clitoris", "clits", "cnut", "cock", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cokmuncher", "coon", "cowgirl", "cowgirls", "crap", "crotch", "cum", "cuming", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlicker", "cuntlicking", "cunts", "damn", "deepthroat", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dlck", "dog style", "dog-fucker", "doggiestyle", "doggin", "dogging", "doggystyle", "dong", "donkeyribber", "doofus", "doosh", "dopey", "douche", "douchebag", "douchebags", "douchey", "drunk", "duche", "dumass", "dumbass", "dumbasses", "dummy", "dyke", "dykes", "eatadick", "eathairpie", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "enlargement", "erect", "erection", "erotic", "erotism", "essohbee", "extacy", "extasy", "facial", "fack", "fag", "fagg", "fagged", "fagging", "faggit", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "faig", "faigt", "fanny", "fannybandit", "fannyflaps", "fannyfucker", "fanyy", "fart", "fartknocker", "fat", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felch", "felcher", "felching", "fellate", "fellatio", "feltch", "feltcher", "femdom", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fingering", "fisted", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "fisting", "fisty", "flange", "flogthelog", "floozy", "foad", "fondle", "foobar", "fook", "fooker", "footjob", "foreskin", "freex", "frigg", "frigga", "fubar", "fuck", "fucka", "fuckass", "fuckbitch", "fucked", "fucker", "fuckers", "fuckface", "fuckhead", "fuckheads", "fuckhole", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fuckmeat", "fucknugget", "fucknut", "fuckoff", "fuckpuppet", "fucks", "fucktard", "fucktoy", "fucktrophy", "fuckup", "fuckwad", "fuckwhit", "fuckwit", "fuckyomama", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fukking", "fuks", "fukwhit", "fukwit", "futanari", "futanary", "fux", "fuxor", "fxck", "gae", "gai", "gangbang", "gangbanged", "gangbangs", "ganja", "gassyass", "gay", "gaylord", "gays", "gaysex", "gey", "gfy", "ghay", "ghey", "gigolo", "glans", "goatse", "god", "godamn", "godamnit", "goddam", "goddammit", "goddamn", "goddamned", "gokkun", "goldenshower", "gonad", "gonads", "gook", "gooks", "gringo", "gspot", "gtfo", "guido", "hamflap", "handjob", "hardcoresex", "hardon", "hebe", "heeb", "hell", "hemp", "hentai", "heroin", "herp", "herpes", "herpy", "heshe", "hitler", "hiv", "hoar", "hoare", "hobag", "hoer", "homey", "homo", "homoerotic", "homoey", "honky", "hooch", "hookah", "hooker", "hoor", "hootch", "hooter", "hooters", "hore", "horniest", "horny", "hotsex", "howtokill", "howtomurdep", "hump", "humped", "humping", "hussy", "hymen", "inbred", "incest", "injun", "jackass", "jackhole", "jackoff", "jap", "japs", "jerk", "jerked", "jerkoff", "jism", "jiz", "jizm", "jizz", "jizzed", "junkie", "junky", "kawk", "kike", "kikes", "kill", "kinbaku", "kinky", "kinkyJesus", "kkk", "klan", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kooch", "kooches", "kootch", "kraut", "kum", "kummer", "kumming", "kums", "kunilingus", "kwif", "kyke", "l3itch", "labia", "lech", "len", "leper", "lesbians", "lesbo", "lesbos", "lez", "lezbian", "lezbians", "lezbo", "lezbos", "lezzie", "lezzies", "lezzy", "lmao", "lmfao", "loin", "loins", "lube", "lust", "lusting", "lusty", "m-fucking", "mafugly", "mams", "masochist", "massa", "masterb8", "masterbate", "masterbating", "masterbation", "masterbations", "masturbate", "masturbating", "masturbation", "maxi", "menses", "menstruate", "menstruation", "meth", "milf", "mofo", "molest", "moolie", "moron", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "motherfuck", "motherfucka", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "mtherfucker", "mthrfucker", "mthrfucking", "muff", "muffdiver", "muffpuff", "murder", "mutha", "muthafecker", "muthafuckaz", "muthafucker", "muthafuckker", "muther", "mutherfucker", "mutherfucking", "muthrfucking", "nad", "nads", "naked", "napalm", "nappy", "nazi", "nazism", "needthedick", "negro", "nig", "nigg", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "niggle", "niglet", "nimrod", "ninny", "nipple", "nipples", "nob", "nobhead", "nobjocky", "nobjokey", "nooky", "nude", "nudes", "numbnuts", "nutbutter", "nutsack", "nympho", "omg", "opiate", "opium", "oral", "orally", "organ", "orgasim", "orgasims", "orgasm", "orgasmic", "orgasms", "orgies", "orgy", "ovary", "ovum", "ovums", "paddy", "paki", "pantie", "panties", "panty", "pastie", "pasty", "pawn", "pcp", "pecker", "pedo", "pedophile", "pedophilia", "pedophiliac", "pee", "peepee", "penetrate", "penetration", "penial", "penile", "penis", "penisfucker", "perversion", "peyote", "phalli", "phallic", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pillowbiter", "pimp", "pimpis", "pinko", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "playboy", "pms", "polack", "pollock", "poon", "poontang", "poop", "porn", "porno", "pornography", "pornos", "pot", "potty", "prick", "pricks", "prig", "pron", "prostitute", "prude", "pube", "pubic", "pubis", "punkass", "punky", "puss", "pusse", "pussi", "pussies", "pussy", "pussyfart", "pussypalace", "pussypounder", "pussys", "puto", "queaf", "queef", "queer", "queero", "queers", "quicky", "quim", "racy", "rape", "raped", "raper", "raping", "rapist", "raunch", "rectal", "rectum", "rectus", "reefer", "reetard", "reich", "retard", "retarded", "revue", "rimjaw", "rimjob", "rimming", "ritard", "rtard", "rum", "rump", "rumprammer", "ruski", "sadism", "sadist", "sandbar", "sausagequeen", "scag", "scantily", "schizo", "schlong", "screw", "screwed", "screwing", "scroat", "scrog", "scrot", "scrote", "scrotum", "scrud", "scum", "seaman", "seamen", "seduce", "semen", "sex", "sexual", "shag", "shagger", "shaggin", "shagging", "shamedame", "shemale", "shibari", "shibary", "shit", "shitdick", "shite", "shiteater", "shited", "shitey", "shitface", "shitfuck", "shitfucker", "shitfull", "shithead", "shithole", "shithouse", "shiting", "shitings", "shits", "shitt", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "shiz", "shota", "sissy", "skag", "skank", "slave", "sleaze", "sleazy", "slope", "slut", "slutbucket", "slutdumper", "slutkiss", "sluts", "smegma", "smut", "smutty", "snatch", "sniper", "snuff", "sob", "sodom", "son-of-a-bitch", "souse", "soused", "spac", "sperm", "spic", "spick", "spik", "spiks", "spooge", "spunk", "steamy", "stfu", "stiffy", "stoned", "strip", "strip club", "stripclub", "stroke", "stupid", "suck", "sucked", "sucking", "sumofabiatch", "tampon", "tard", "tawdry", "teabagging", "teat", "teets", "teez", "terd", "teste", "testee", "testes", "testical", "testicle", "testis", "threesome", "throating", "thrust", "thug", "tinkle", "tit", "titfuck", "titi", "tits", "titt", "tittiefucker", "titties", "titty", "tittyfuck", "tittyfucker", "tittywank", "titwank", "toke", "toots", "tosser", "tramp", "transsexual", "trashy", "tubgirl", "turd", "tush", "twat", "twathead", "twats", "twatty", "twunt", "twunter", "ugly", "undies", "unwed", "urinal", "urine", "uterus", "uzi", "vag", "vagina", "valium", "viagra", "vigra", "virgin", "vixen", "vodka", "vomit", "voyeur", "vulgar", "vulva", "wad", "wang", "wank", "wanker", "wanky", "wazoo", "wedgie", "weed", "weenie", "weewee", "weiner", "weirdo", "wench", "wetback", "whitey", "whiz", "whoar", "whoralicious", "whore", "whorealicious", "whored", "whoreface", "whorehopper", "whorehouse", "whores", "whoring", "wigger", "willies", "willy", "womb", "woody", "woose", "wop", "wtf", "x-rated2g1c", "xx", "xxx", "yaoi", "yury"];
    const censoredText = await censorText(text, obsceneWordsList);
    if (text !== censoredText) {
      node.textContent = censoredText;
    }
  
    if (words.length > 1 && shouldSendTextForProcessing(text)) {
      const serverEndpoint = 'http://localhost:8000/process_text';
      try {
        const response = await fetch(serverEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: text
          }),
        });
        const data = await response.json();
        if (data.toxic === true) {
          const toxicSpan = document.createElement('span');
          toxicSpan.textContent = censoredText;
          toxicSpan.classList.add('toxic-text');
  
          // Replace the node's content with the toxic span
          const parent = node.parentNode;
          parent.replaceChild(toxicSpan, node);
          displayPopup(data.message);
        }
      } catch (error) {
        console.error('Error sending uncensored data to the server:', error);
      }
    }
  }
  
  let isPopupDisplayed = false;
  function displayPopup(message) {
    if (isPopupDisplayed) {
      return;
    }
  
    // Create the popup element
    const popup = document.createElement('div');
    popup.classList.add('popup');
  
    // Create the close button for the popup
    const closeButton = document.createElement('span');
    closeButton.textContent = '✖'; // You can use any close icon here
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(popup);
      // isPopupDisplayed = false; // Don't want to get it again and again
    });
  
    // Create the content message for the popup
    const content = document.createElement('div');
    content.textContent = message;
  
    // Append the close button and content to the popup
    popup.appendChild(closeButton);
    popup.appendChild(content);
  
    // Style the popup
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
  
    popup.style.padding = '10px';
    popup.style.background = 'red';
    popup.style.color = 'white';
    popup.style.zIndex = '9999';
  
    // Append the popup to the body
    document.body.appendChild(popup);
    isPopupDisplayed = true;
  }
  
  function shouldSendTextForProcessing(text) {
    if (/^\s*<style>/.test(text)) {
      return false;
    }
    
    const unwantedPatterns = [
      /\/\*\*.*\*\/\s*'use strict';/,
      /function\s*\(.*\)\s*{/
    ];
  
    for (const pattern of unwantedPatterns) {
      if (pattern.test(text)) {
        return false;
      }
    }
  
    return true;
  }
  
  async function sendAllText() {
    const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let currentNode;
  
    while ((currentNode = textWalker.nextNode())) {
      const text = currentNode.textContent.trim();
      if (text !== '') {
        sendTextForProcessing(currentNode, text);
      }
    }
  }
  
  async function observeDynamicText() {
    const observer = new MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('toxic-text')) return;
          await traverseNodeAndProcessText(node);
        }
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  async function traverseNodeAndProcessText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text !== '') {
        await sendTextForProcessing(node, text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childNodes = node.childNodes;
      for (const childNode of childNodes) {
        await traverseNodeAndProcessText(childNode);
      }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM loaded");
    sendAllText();
    observeDynamicText();
});