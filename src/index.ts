
export type Cb<T> = (t: T) => void;

export type OptArg<T> = T extends void ? [] : [T]; // allow parameterless emit

// https://github.com/microsoft/TypeScript/issues/13573
type Subs<T> = {
  [E in keyof T]?: Cb<T[E]>[];
};

export class EE<T = { [str: string]: any }> {
  private readonly subs: Subs<T> = {};

  private getSubs<E extends keyof T>(e: E) {
    return (this.subs[e] || (this.subs[e] = [])) as Cb<T[E]>[];
  }

  on<E extends keyof T>(e: E, fn: Cb<T[E]>) {
    this.getSubs(e).push(fn);

    return this;
  }

  once<E extends keyof T>(e: E, fn: Cb<T[E]>) {
    const wrap: Cb<T[E]> = (arg) => {
      this.off(e, wrap);

      fn.call(null, arg);
    };

    this.getSubs(e).push(wrap);

    return this;
  }

  off<E extends keyof T>(e: E, fn?: Cb<T[E]>) {
    const subs = this.getSubs(e);

    if (fn) {
      const idx = subs.indexOf(fn);

      if (idx !== -1) {
        subs.splice(idx, 1); // only remove one
      }
    }
    else {
      subs.length = 0; // truncate
    }

    return this;
  }

  emit<E extends keyof T>(e: E, ...arg: OptArg<T[E]>) {
    const subs = this.getSubs(e);

    subs.slice().forEach(s => s.apply(null, arg as [T[E]]));

    return this;
  }

  event<E extends keyof T>(e: E, ...arg: OptArg<T[E]>) {
    setTimeout(() => this.emit(e, ...arg), 0);

    return this;
  }
}
