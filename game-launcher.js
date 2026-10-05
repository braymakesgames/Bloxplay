const BloxPlayGameLauncher = {

    launch(gameName) {

        if (gameName === "Mystery Hunt") {
            this.mysteryHunt();
            return;
        }

        if (gameName === "Brain Grab") {
            this.brainGrab();
            return;
        }

        if (gameName === "Island Survival") {
            this.islandSurvival();
            return;
        }

        if (gameName === "Block Racers") {
            this.blockRacers();
            return;
        }

        if (gameName === "Ghost Hunt") {
            this.ghostHunt();
            return;
        }

        if (gameName === "Coin Rush") {
            this.coinRush();
            return;
        }

        if (gameName === "Build City") {
            this.buildCity();
            return;
        }

        alert("Game not found.");
    },


    mysteryHunt() {

        const app = document.getElementById("app");

        let score = 0;
        let clues = 0;

        const suspects = [
            "Alex",
            "Jordan",
            "Sam",
            "Riley"
        ];

        const hunter =
            suspects[
                Math.floor(
                    Math.random() * suspects.length
                )
            ];

        app.innerHTML = `

            <div style="
                background:#111827;
                min-height:500px;
                padding:20px;
                border-radius:15px;
            ">

                <h1>🕵️ Mystery Hunt</h1>

                <p>
                    Find the hidden hunter before the round ends.
                </p>

                <h2>
                    Clues: <span id="clueCount">0</span>
                </h2>

                <h2>
                    Score: <span id="mysteryScore">0</span>
                </h2>

                <div id="suspects"></div>

                <br>

                <button onclick="BloxPlayGameLauncher.collectClue()">
                    🔎 Find Clue
                </button>

                <button onclick="BloxPlayGameLauncher.endMystery()">
                    🚪 Leave Game
                </button>

                <p id="mysteryMessage"></p>

            </div>
        `;

        this.mysteryHunter = hunter;
        this.mysteryScore = score;
        this.mysteryClues = clues;

        this.renderSuspects();
    },


    renderSuspects() {

        const container =
            document.getElementById("suspects");

        if (!container) return;

        const suspects = [
            "Alex",
            "Jordan",
            "Sam",
            "Riley"
        ];

        container.innerHTML =
            suspects.map(name => `

                <button
                    onclick="
                        BloxPlayGameLauncher.guessHunter('${name}')
                    "
                    style="
                        display:block;
                        width:100%;
                        margin:10px 0;
                        padding:15px;
                        background:#29364d;
                    "
                >
                    👤 ${name}
                </button>

            `).join("");
    },


    collectClue() {

        this.mysteryClues++;

        this.mysteryScore += 10;

        const clue =
            document.getElementById("clueCount");

        const score =
            document.getElementById("mysteryScore");

        if (clue) {
            clue.textContent =
                this.mysteryClues;
        }

        if (score) {
            score.textContent =
                this.mysteryScore;
        }

        const message =
            document.getElementById("mysteryMessage");

        if (message) {

            message.textContent =
                "🔎 You found a clue! Look carefully at the suspects.";
        }
    },


    guessHunter(name) {

        const message =
            document.getElementById("mysteryMessage");

        if (name === this.mysteryHunter) {

            this.mysteryScore += 100;

            if (message) {

                message.innerHTML =
                    "🎉 You found the hunter! You won!<br>" +
                    "Score: " +
                    this.mysteryScore;
            }

        } else {

            if (message) {

                message.innerHTML =
                    "❌ Wrong suspect! Keep searching.";
            }
        }
    },


    endMystery() {

        if (typeof showGames === "function") {
            showGames();
        }
    },


    brainGrab() {
        alert("Brain Grab is next.");
    },


    islandSurvival() {
        alert("Island Survival is next.");
    },


    blockRacers() {
        alert("Block Racers is next.");
    },


    ghostHunt() {
        alert("Ghost Hunt is next.");
    },


    coinRush() {
        alert("Coin Rush is next.");
    },


    buildCity() {
        alert("Build City is next.");
    }

};
