import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rows: number = 12;
  seatsPerRow: number[] = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];
  seats: boolean[][] = Array.from({ length: this.rows }, (_, i) => Array(this.seatsPerRow[i]).fill(false));
  remainingSeats: number = 80;

  // Book seats method
  bookSeats(seatsToBook: number): void {
    if (seatsToBook < 1 || seatsToBook > 7) {
      alert('You can only book between 1 to 7 seats.');
      return;
    }

    if (!this.tryBookInRow(seatsToBook)) {
      if (!this.bookNearbySeats(seatsToBook)) {
        alert('Unable to book seats. Not enough adjacent seats available.');
      }
    }

    this.displayCoach();
  }

  // Try to book seats in a single row
  tryBookInRow(seatsToBook: number): boolean {
    for (let row = 0; row < this.rows; row++) {
      if (this.seatsPerRow[row] < seatsToBook) continue; // skip rows with fewer seats

      for (let start = 0; start <= this.seatsPerRow[row] - seatsToBook; start++) {
        const canBook = this.seats[row].slice(start, start + seatsToBook).every(seat => !seat);

        if (canBook) {
          for (let j = start; j < start + seatsToBook; j++) {
            this.seats[row][j] = true;
          }
          this.remainingSeats -= seatsToBook;
          alert(`Booked ${seatsToBook} seats in row ${row + 1}`);
          return true;
        }
      }
    }
    return false;
  }

  // Book nearby seats if not possible in one row
  bookNearbySeats(seatsToBook: number): boolean {
    let seatsBooked = 0;

    for (let row = 0; row < this.rows; row++) {
      for (let j = 0; j < this.seatsPerRow[row]; j++) {
        if (!this.seats[row][j]) {
          this.seats[row][j] = true;
          seatsBooked++;
          this.remainingSeats--;

          if (seatsBooked === seatsToBook) {
            alert(`Booked ${seatsToBook} nearby seats.`);
            return true;
          }
        }
      }
    }
    return false;
  }

  // Display current seating arrangement
  displayCoach(): void {
    console.log('Current seating arrangement:');
    this.seats.forEach((row, rowIndex) => {
      console.log(`Row ${rowIndex + 1}: ` + row.map(seat => seat ? '[X]' : '[ ]').join(' '));
    });
    console.log('Remaining seats: ' + this.remainingSeats);
  }
}
