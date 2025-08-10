const scoreRegex = "[[0-9]+.*, [0-9]+]";
const bracketsRegex = "/[\[\]']+/g";
const delta = 0.0001;

displayScore();

function displayScore() {
    let tableRows = document.getElementsByClassName("album_info")[0].getElementsByTagName("tbody")[0];

    scoreRow = createTableRow();
    
    // Append table row after RYM rating
    rowAfter = tableRows.childNodes[8];
    tableRows.insertBefore(scoreRow, rowAfter)
}

function getScore() {
    // Retrieve score code from DOM
    const chartScript = document.getElementById("chart_div")
                        .parentNode
                        .getElementsByTagName("script")[0].innerHTML;

    // Parse score code
    const scoreMatches = chartScript.match(scoreRegex)[0]
                        .split(",[");
    const scoreMap = matchToMap(scoreMatches);

    return mapToScore(scoreMap);
}

function createTableRow() {
    // Get score to display
    try {
        var score = getScore();
    }

    catch {
         var score = NaN;
    }

    var score = getScore();

    const scoreRow = document.createElement("tr")
    scoreRow.innerHTML = `
                        <th class="info_hdr">Tomato Rating</th><td colspan="2" style="padding:4px;">
                        <span > 
                        <span class="avg_rating" >
                            ${score}%
                        </span> 
                        </span>
                        </td>
                        `; 
    return scoreRow;
}

function matchToMap(matches) {
    const scores = new Map();

    // Parse scores from HTML data
    matches.forEach((match) => {
        var cleanMatch = match.replace("[", "");
        cleanMatch = cleanMatch.replace("]", "");
        pair = cleanMatch.split(", ");
        console.log(pair)
        scores.set(Number(pair[0]), Number(pair[1]));
    });

    return scores;
}

function mapToScore(scores) {
    let ratings = 0;
    let negRatings = 0;
    let posRatings = 0;

    // Calculate positive and negative scores
    for (const [score, ratingNum] of scores) {
        ratings += ratingNum;

        if (lesserThan(score, 3)) {
            negRatings += ratingNum;
        }

        else if (deltaEqual(score, 3)) {
            negRatings += ratingNum / 2;
            posRatings += ratingNum / 2;
        }

        else if (greaterThan(score, 3)) {
            posRatings += ratingNum;
        }
    }

    // Returns a round percentage value to be displayed on the page.
    return Math.round((posRatings / ratings) * 100);
}

function greaterThan(l, r) {
    return l > r && !deltaEqual(l, r);
}

function lesserThan(l, r) {
    return !greaterThan(l, r) && !deltaEqual(l, r);
}

function deltaEqual(l, r) {
    return Math.abs(l - r) < delta
}