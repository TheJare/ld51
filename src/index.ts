"use strict";

enum MatchResult {
  None,
  Partial,
  Full,
}

const kSeconds = 10;

class Row {
  ops: number[] = [0, 0];
  public elNode: HTMLElement;
  public time: number = 0;
  public expired: boolean = false;
  public difficulty: number;

  constructor(difficulty: number) {
    let exp = Math.log10(difficulty);
    let max = 10 ** (exp + 0.2 + Math.random() * 0.8);
    let min = 10 ** Math.floor(exp);
    this.difficulty = difficulty;
    this.ops[0] = Math.floor(Math.random() * (max - min) + min);
    this.ops[1] = Math.floor(Math.random() * (max - min) + min);
    this.time = kSeconds;
    this.elNode = document.createElement("div");
    this.update("");
  }

  public tick() {
    this.time = Math.max(0, this.time - 1);
    this.expired = this.time <= 0;
  }

  public update(input: string) {
    let match = this.matchInput(input);
    let display = match != MatchResult.None ? input + "..." : "___";
    let s = this.time;
    let score = s > 0 ? Array(s + 1).join("#") + Array(kSeconds + 1 - s).join("·") : "";
    this.elNode.innerHTML = `${this.ops[0]} + ${this.ops[1]} = <span class="scoremeter">${display} ${score}</span>`;
  }

  public matchInput(input: string): MatchResult {
    let s = (this.ops[0] + this.ops[1]).toString();
    let matches =
      input == ""
        ? MatchResult.None
        : s == input
        ? MatchResult.Full
        : s.startsWith(input)
        ? MatchResult.Partial
        : MatchResult.None;
    return matches;
  }
}

export class Game {
  elBoard: HTMLElement;
  elScore: HTMLElement;
  elState: HTMLElement;

  audioNew: HTMLAudioElement;
  audioFail: HTMLAudioElement;
  audioOver: HTMLAudioElement;
  audioEnabled: boolean = false;

  items: Row[] = [];
  accumulated: string = "";
  score: number = 0;
  difficulty: number = 1;
  gameOver: boolean = false;

  constructor() {
    document.addEventListener("keypress", (event) => this.onKey(event.key));
    this.elBoard = document.getElementById("board");
    this.elScore = document.getElementById("score");
    this.elState = document.getElementById("state");
    this.audioNew = new Audio("right.wav");
    this.audioFail = new Audio("fail.wav");
    this.audioOver = new Audio("over.wav");
    setInterval(() => this.tick(), 1000);
    this.reset();
    this.addItem();
  }

  playSound(sound: HTMLAudioElement) {
    if (this.audioEnabled) {
      sound.play();
    }
  }

  reset() {
    this.items = [];
    while (this.elBoard.hasChildNodes()) {
      this.elBoard.removeChild(this.elBoard.children[0]);
    }
    this.accumulated = "";
    this.score = 0;
    this.difficulty = 7;
    this.gameOver = false;
  }

  tick() {
    if (this.gameOver) {
      return;
    }
    this.difficulty *= 1.03;
    this.elState.innerHTML = `(difficulty: ${Math.floor(this.difficulty)})`;
    let now = Date.now();
    let allExpired = true;
    for (let i = this.items.length - 1; i >= 0; i--) {
      this.items[i].tick();
      this.items[i].update(this.accumulated);
      allExpired = allExpired && this.items[i].expired;
    }
    if (allExpired) {
      this.addItem();
    }
  }

  addItem() {
    if (this.items.length >= 5) {
      this.playSound(this.audioOver);
      this.gameOver = true;
      this.elState.innerHTML = `<span style="color:red">Game Over</span> (difficulty: ${Math.floor(this.difficulty)})`;
    } else {
      this.playSound(this.audioNew);
      let item = new Row(Math.floor(this.difficulty));
      this.elBoard.appendChild(item.elNode);
      this.items.push(item);
    }
  }

  onKey(key: string) {
    this.audioEnabled = true;
    if (this.gameOver) {
      this.reset();
      return;
    }
    if (key[0] >= "0" && key[0] <= "9") {
      let now = Date.now();
      let accepted = false;
      let completed = false;
      let playSound = false;
      this.accumulated = this.accumulated + key;
      for (let i = this.items.length - 1; i >= 0; i--) {
        let item = this.items[i];
        item.update(this.accumulated);
        let r = item.matchInput(this.accumulated);
        accepted = accepted || r == MatchResult.Partial;
        if (r == MatchResult.Full) {
          this.elBoard.removeChild(item.elNode);
          let itemScore = item.time * item.difficulty;
          if (itemScore > 0) {
            this.score += itemScore;
            this.elScore.innerText = this.score.toString();
            completed = true;
          }
          this.items.splice(i, 1);
          playSound = true;
        }
      }
      if (!accepted) {
        this.accumulated = "";
        if (!playSound) {
          this.playSound(this.audioFail);
        }
      }
      if (completed) {
        this.addItem();
      } else if (playSound) {
        this.playSound(this.audioNew);
      }
    }
  }
}

window.addEventListener("load", () => {
  const game = new Game();
});
