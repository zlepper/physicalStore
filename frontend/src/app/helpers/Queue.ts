export class Queue<T> {
  private items: T[] = [];
  private running = 0;

  constructor(private callback: (item: T, done: () => void) => void, private maxParallel = 1) {

  }

  public add(item: T) {
    this.items.push(item);
    this.startNext();
  }

  private startNext() {
    console.log('starting next upload', this);
    if (this.running < this.maxParallel) {
      if (this.items.length > 0) {
        const item = this.items.shift();
        if (item) {
          this.running++;
          this.callback(item, () => {
            console.log('done');
            this.running--;
            this.startNext();
          });
        }
      }
    }
  }
}
