var vm = new Vue({
    el: "#app",

    data: {
        tiles: [], // initialized with the default tiles in tiles.json
        games: {}, // initialized with the default games in games.json
        selectedGameName: "First",
        selectedGame: [],
        tileQuery: null,
        tileQueryIsComplete: true,
        selectedTile: {
            title: "",
            text: ""
        }
    },

    computed: {
        gameNames() {
            return _.map(this.games, (v, k) => k);
        },

        tileQueryIsValid() {
            return this.tileQuery >= 1 && this.tileQuery <= 54;
        },

        showTileCard() {
            return this.tileQueryIsValid && this.tileQueryIsComplete;
        }
    },

    methods: {
        initializeGame() {
            this.selectedGame = [];
            for (var multiTile of this.games[this.selectedGameName].tiles) {
                var masterTile = _.find(this.tiles, function(t) {
                    return t[0] === multiTile[1];
                });
                if (masterTile === undefined) {
                    console.warn(`Could not find tile with title "${multiTile[1]}" in tiles.json`);
                }
                for (var i = multiTile[0]; i > 0; i -= 1) {
                    this.selectedGame.push(masterTile);
                }
            }
            this.selectedGame = _.shuffle(this.selectedGame);
        },

        updateSelectedTile: _.debounce(function() {
            this.tileQueryIsComplete = true;
            if (this.tileQueryIsValid) {
                this.selectedTile.title = this.selectedGame[this.tileQuery - 1][0];
                this.selectedTile.text = this.selectedGame[this.tileQuery - 1][1];
            } else {
                this.selectedTile.title = "";
                this.selectedTile.text = "";
            }
        }, 1000)
    },

    watch: {
        // re-initialize tile-number mapping if selected game name changes
        selectedGameName() {
            this.initializeGame();
        },

        tileQuery() {
            this.tileQueryIsComplete = false;
            this.updateSelectedTile();
        }
    },

    mounted: function() {
        axios
            // make two requests for the default tiles and games data
            .all([axios.get("tiles.json"), axios.get("games.json")])
            .then(
                // if both requests succeed
                axios.spread((tiles_resp, games_resp) => {
                    // save results of both requests into the data object
                    this.tiles = tiles_resp.data;
                    this.games = games_resp.data;
                    // initialize first tile-number mapping using the default game
                    this.initializeGame();
                })
            )
            .catch(error => {
                // if one of the requests fails
                console.log(error);
            });
    }
});
