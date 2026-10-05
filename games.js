const BlockPlayGames = [
    {
        name: "Mystery Hunt",
        icon: "🕵️",
        description: "Find the hidden hunter and survive the round.",
        tags: "mm2 mystery detective"
    },

    {
        name: "Brain Grab",
        icon: "🧠",
        description: "Collect characters and bring them back to your base.",
        tags: "sab collecting base"
    },

    {
        name: "Island Survival",
        icon: "🏝️",
        description: "Survive on a dangerous block island.",
        tags: "survival island"
    },

    {
        name: "Block Racers",
        icon: "🏎️",
        description: "Race through blocky tracks.",
        tags: "racing cars race"
    },

    {
        name: "Ghost Hunt",
        icon: "👻",
        description: "Search the map for mysterious ghosts.",
        tags: "ghost hunt"
    },

    {
        name: "Coin Rush",
        icon: "🪙",
        description: "Collect as many coins as possible.",
        tags: "coins money simulator"
    },

    {
        name: "Build City",
        icon: "🏙️",
        description: "Build your own block city.",
        tags: "building city"
    }
];

function searchBlockPlayGames(searchText) {

    const search = searchText
        .toLowerCase()
        .trim();

    if (!search) {
        return BlockPlayGames;
    }

    return BlockPlayGames.filter(game =>
        game.name.toLowerCase().includes(search) ||
        game.description.toLowerCase().includes(search) ||
        game.tags.toLowerCase().includes(search)
    );
}

function getBlockPlayGame(gameName) {

    return BlockPlayGames.find(
        game => game.name === gameName
    );
}
