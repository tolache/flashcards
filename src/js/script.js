populateAllCards();

function populateAllCards() {
    const cards = document.getElementsByClassName('card');

    async function populateOneCard(card) {
        const currentRandomVerb = await randomVerb();
        const frontText = currentRandomVerb.infinitive;
        const backText = currentRandomVerb.english;
        setCardFrontText(card, frontText);
        setCardBackText(card, backText);
    }

    for (let i = 0; i < cards.length; i++) {
        populateOneCard(cards[i]);
    }
}

async function randomVerb() {
    const rawVerbData = await readAllLinesFromFile('../data/verbs.csv');
    const rawLinesWithoutHeader = rawVerbData.split("\n").slice(1);
    let verbCount = rawLinesWithoutHeader.length;
    const randomVerbIndex = Math.floor(Math.random() * (verbCount))
    const rawRandomVerb = rawLinesWithoutHeader[randomVerbIndex];
    const myVerb = new ParseVerb(rawRandomVerb);

    console.log(`${myVerb.english}:
${myVerb.infinitive}
${myVerb.pastIndicative}
${myVerb.pastParticiple}
${myVerb.auxVerb}`);

    return myVerb;
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