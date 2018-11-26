#!/usr/bin/env python3

import json
import os
import random


TILES_DIR = "tiles"
TILES_PER_GAME = 54


def main():
    available_tiles = load_tiles_from_directory(TILES_DIR)
    while True:
        user_input = input(
            "[s]tart new game, [r]eload tiles from directory or [q]uit program? "
        )
        if user_input in "sS":
            start_game(available_tiles)
        elif user_input in "rR":
            available_tiles = load_tiles_from_directory(TILES_DIR)
        elif user_input in "qQ":
            print("Quitting program.")
            break
        else:
            print("Unrecognized input.")


def load_tiles_from_directory(directory):
    tiles = []
    print(f"Scanning '{directory}' for tiles...")
    for tiles_file in os.listdir(directory):
        with open(os.path.join(directory, tiles_file)) as f:
            game_dict = json.load(f)
            for tile in game_dict["tiles"]:
                tiles.append(tile)
    print(f"Found {len(tiles)} tiles in '{directory}'")
    return tiles


def start_game(available_tiles):
    print(f"Getting random sample of {TILES_PER_GAME} tiles to use this game...")
    game_tiles = random.sample(available_tiles, TILES_PER_GAME)
    print("Game start!")
    for i, tile in enumerate(game_tiles):
        user_input = input("Press ENTER to reveal the next tile, or [q]uit round: ")
        if user_input == " " or user_input == "":
            print("")
            print(f"{i+1}/{len(game_tiles)} tiles have been revealed.\n")
            print(tile["name"])
            print(tile["text"])
            print("")
        elif user_input in "qQ":
            print("Quitting round.")
            break
        else:
            print("Unrecognized input.")


if __name__ == "__main__":
    main()
