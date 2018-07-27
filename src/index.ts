
export type Cb<T = any> = (t: T) => void;

interface Subs<T> {
  [event: string]: { fn: Cb<T>; wrap?: Cb<T> }[];
}

export class EE<T = any> {
  private readonly subs: Subs<T> = {};

  on(event: string, fn: Cb<T>) {
    if (!this.subs[event]) {
      this.subs[event] = [];
    }

    this.subs[event].push({ fn });

    return this;
  }

  once(event: string, fn: Cb<T>) {
    if (!this.subs[event]) {
      this.subs[event] = [];
    }

    this.subs[event].push({
      fn,
      wrap: (arg?: T) => {
        this.off(event, fn);

        fn.call(null, arg);
      }
    });

    return this;
  }

  off(event: string, fn?: Cb<T>) {
    if (!this.subs[event]) {
      this.subs[event] = [];
    }

    if (!fn) {
      this.subs[event].length = 0; // truncate
    }
    else {
      for (let i = 0; i < this.subs[event].length; i++) {
        if (this.subs[event][i].fn === fn) {
          this.subs[event].splice(i, 1);
          break; // only remove one
        }
      }
    }

    return this;
  }

  emit(event: string, arg?: T) {
    if (!this.subs[event]) {
      this.subs[event] = [];
    }

    for (const s of this.subs[event]) {
      (s.wrap || s.fn).call(null, arg);
    }

    return this;
  }

  event(event: string, arg?: T) {
    // @ts-ignore
    setTimeout(() => this.emit(event, arg), 0);

    return this;
  }
}
