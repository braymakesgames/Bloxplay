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
        alert("Mystery Hunt is loading...");
    },

    brainGrab() {
        alert("Brain Grab is loading...");
    },

    islandSurvival() {
        alert("Island Survival is loading...");
    },

    blockRacers() {
        alert("Block Racers is loading...");
    },

    ghostHunt() {
        alert("Ghost Hunt is loading...");
    },

    coinRush() {
        alert("Coin Rush is loading...");
    },

    buildCity() {
        alert("Build City is loading...");
    }
};
