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
                var masterTile = _.find(this.tiles, function(t) {
                    return t[0] === multiTile[1];
                });
                for (var i = multiTile[0]; i > 0; i -= 1) {
                    this.activeGame.push(masterTile);
                }
            }
            this.activeGame = _.shuffle(this.activeGame);
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

        // re-initialize tile-number mapping if selected game name changes
        var unwatchSelectedGameName = this.$watch("selectedGameName", (o, n) => {
            this.initializeGame();
        });
    }
});
