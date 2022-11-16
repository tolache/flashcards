addCurrentThemeClass();

const languageFromTo = {
    NlEn: "NL>EN",
    EnNl: "EN>NL"
}

let language = languageFromTo.NlEn;
let verbs = [];

setLanguageLabel(language);
populateAllCards().then();

function switchLanguage() {
    if (language === languageFromTo.NlEn) {
        language = languageFromTo.EnNl;
        setLanguageLabel(language);
        populateAllCards().then();
    } else {
        language = languageFromTo.NlEn
        setLanguageLabel(language);
        populateAllCards().then();
    }
}

function setLanguageLabel(caption) {
    const label = document.getElementById('language-label');
    label.innerText = caption;
}

function switchDarkMode() {
    addCurrentThemeClass();

    if (document.documentElement.classList.contains('light')) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

function addCurrentThemeClass() {
    if (!document.documentElement.classList.contains('light') && !document.documentElement.classList.contains('dark')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.add('light');
        }
    }
}

async function populateAllCards() {
    const cards = document.getElementsByClassName('card');

    if (verbs.length < cards.length) {
        await populateVerbs();
    }

    for (let i = 0; i < cards.length; i++) {
        const verbCount = verbs.length;
        const randomVerbIndex = Math.floor(Math.random() * verbCount)
        const verb = verbs[randomVerbIndex];

        let frontText;
        let backText;
        if (language === languageFromTo.NlEn) {
            frontText = verb.infinitive;
            backText = `${verb.pastIndicative}
                        ${verb.auxVerbHint}${verb.pastParticiple}
                        
                        (${verb.english})`
                .replace(/^ */gm, '');
        } else {
            frontText = verb.english;
            backText = `${verb.infinitive}
                        ${verb.pastIndicative}
                        ${verb.auxVerbHint}${verb.pastParticiple}`
                .replace(/^ */gm, '');
        }
        setCardFrontText(cards[i], frontText);
        setCardBackText(cards[i], backText);

        verbs.splice(randomVerbIndex, 1);
    }

    function setCardFrontText(card, text) {
        card.children[0].children[0].textContent = text;
    }

    function setCardBackText(card, text) {
        card.children[1].children[0].textContent = text;
    }
}

async function populateVerbs() {
    const rawVerbData = await readAllLinesFromFile('../data/verbs.csv');
    const rawLinesWithoutHeader = rawVerbData.split("\n").slice(1);
    rawLinesWithoutHeader.forEach(line => verbs.push(new ParseVerb(line)));
}

async function readAllLinesFromFile(file) {
    const response = await fetch(file);
    return await response.text();
}

function ParseVerb(inputString) {
    const fields = inputString.split(',');
    this.infinitive = fields[0];
    this.pastIndicative = fields[1];
    this.pastIndicativePlural = fields[2];
    this.pastParticiple = fields[3];
    this.auxVerb = fields[4];
    this.auxVerbHint = getAuxVerbHint(this.auxVerb);
    this.english = fields[5];

    function getAuxVerbHint(auxVerb) {
        let hint;
        if (auxVerb.includes('hebben') && auxVerb.includes('zijn')) {
            hint = '(*) ';
        } else if (!auxVerb.includes('hebben') && auxVerb.includes('zijn')) {
            hint = '* ';
        } else {
            hint = '';
        }
        return hint;
    }
}