let verbs = [];

populateAllCards().then();

async function populateAllCards() {
    const cards = document.getElementsByClassName('card');

    if (verbs.length < cards.length) {
        await populateVerbs();
    }

    for (let i = 0; i < cards.length; i++) {
        const verbCount = verbs.length;
        const randomVerbIndex = Math.floor(Math.random() * verbCount)

        const verb = verbs[randomVerbIndex];
        const frontText = verb.infinitive;
        const backText = verb.english;
        setCardFrontText(cards[i], frontText);
        setCardBackText(cards[i], backText);
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
    this.pastParticiple = fields[2];
    this.auxVerb = fields[3];
    this.english = fields[4];
}

function setCardFrontText(card, text) {
    card.children[0].children[0].textContent = text;
}

function setCardBackText(card, text) {
    card.children[1].children[0].textContent = text;
}