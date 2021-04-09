export default class UnionFind {
  parent: number[];
  weights: number[];

  constructor(n) {
    this.parent = new Array(n).fill(0).map((v, i) => i);
    this.weights = new Array(n).fill(1);
  }

  find(x) {
    if (this.parent[x] === x) {
      return x;
    }
    return this.parent[x] = this.find(this.parent[x]);
  }

  unite(x, y) {
    let [a, b] = [this.find(x), this.find(y)];
    if (a === b) return false;
    if (this.weights[a] < this.weights[b]) {
      [a, b] = [b, a];
    }
    this.parent[b] = a;
    this.weights[a] += this.weights[b];
    return true;
  }

  isConnected(x, y) {
    return this.find(x) === this.find(y);
  }
}
