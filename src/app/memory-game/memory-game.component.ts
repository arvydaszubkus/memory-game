import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface GameCard {
  id: number;
  symbol: string;
  isMatched: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {
  cards: GameCard[] = [];
  flipped: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.startGame();
  }

  // Start a new game
  startGame() {
    this.http.get<GameCard[]>('http://localhost:5000/api/game/start').subscribe(data => {
      this.cards = data;
    });
  }

  // Reset the game
  resetGame() {
    this.http.post<GameCard[]>('http://localhost:5000/api/game/reset', {}).subscribe(data => {
      this.cards = data;
      this.flipped = [];  // Clear any flipped cards
    });
  }

  flip(card: GameCard) {
    if (this.flipped.length >= 2 || card.isMatched || this.flipped.includes(card.id)) return;

    this.flipped.push(card.id);

    if (this.flipped.length === 2) {
      const [first, second] = this.flipped.map(id => this.cards.find(c => c.id === id)!);
      if (first.symbol === second.symbol) {
        first.isMatched = true;
        second.isMatched = true;
      }
      setTimeout(() => this.flipped = [], 1000);
    }
  }

  isVisible(card: GameCard) {
    return this.flipped.includes(card.id) || card.isMatched;
  }
}
