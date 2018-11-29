var vm = new Vue({
    el: "#app",

    data: {
        tiles: [], // initialized with the default tiles in tiles.json
        games: {}, // initialized with the default games in games.json
        selectedGameName: "First",
        activeGame: []
    },

    computed: {
        gameNames() {
            return _.map(this.games, (v, k) => k);
        }
    },

    methods: {
        initializeGame() {
            this.activeGame = [];
            for (var multiTile of this.games[this.selectedGameName].tiles) {
                console.log(`multiTile: ${multiTile}`);
                var masterTile = _.find(this.tiles, function(t) {
                    return t[0] === multiTile[1];
                });
                console.log(`masterTile: ${masterTile}`);
                for (var i = multiTile[0]; i > 0; i -= 1) {
                    console.log("push");
                    this.activeGame.push(masterTile);
                }
            }
            this.activeGame = _.shuffle(this.activeGame);
            console.log("Game initialized!");
        }
    },

    mounted: function() {
        axios
            .get("tiles.json")
            .then(response => {
                this.tiles = response.data;
            })
            .catch(error => {
                console.log("Failed to load default tiles.");
            });

        axios
            .get("games.json")
            .then(response => {
                this.games = response.data;
            })
            .catch(error => {
                console.log("Failed to load default games.");
            });
    }
});
