import { TestFixture, Test, SpyOn, Expect } from 'alsatian';
import { EE, OptArg } from '../src';

interface Events {
  e: number;
  f: string;
  g: undefined;
  h: [number, number];
  i: { a: string; b: number };
  1: string;
}

interface AnyEvents {
  [e: string]: any;
}

@TestFixture()
export class EETests {
  @Test()
  simpleEvent() {
    const ee = new EE<Events>();

    const spy = { onEvent(_: number) { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.emit('e', 5);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
    Expect(spy.onEvent).toHaveBeenCalledWith(5);
  }

  @Test()
  sameHandlerMulti() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);

    ee.emit('e', 1);
    ee.emit('g');

    Expect(spy.onEvent).toHaveBeenCalled().exactly(2);
  }

  @Test()
  removeHandler() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.off('e', spy.onEvent);

    ee.emit('e', 1);

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeHandlerMulti() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);
    ee.off('e', spy.onEvent);

    ee.emit('e', 1);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
  }

  @Test()
  onceHandler() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.once('e', spy.onEvent);

    ee.emit('e', 1);
    ee.emit('e', 1);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
  }

  @Test()
  removeSomeSubs() {
    const ee = new EE<Events>();

    const spy1 = { onEvent() { /**/ } };
    SpyOn(spy1, 'onEvent');

    const spy2 = { onEvent() { /**/ } };
    SpyOn(spy2, 'onEvent');

    ee.on('e', spy1.onEvent);
    ee.on('e', spy2.onEvent);
    ee.off('e', spy2.onEvent);

    ee.emit('e', 1);

    Expect(spy1.onEvent).toHaveBeenCalled().exactly(1);
    Expect(spy2.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeAllSubs() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);
    ee.off('e');

    ee.emit('e', 1);

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  async asyncEvent() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.event('e', 1);

    Expect(spy.onEvent).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 100));

    Expect(spy.onEvent).toHaveBeenCalled();
  }

  @Test()
  emitMissingEvent() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.emit('g');

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeMissingEvent() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.off('f');

    ee.emit('e', 1);

    Expect(spy.onEvent).toHaveBeenCalled();
  }

  @Test()
  onceHandlerMulti() {
    const ee = new EE<Events>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.once('e', spy.onEvent);
    ee.once('e', spy.onEvent);

    ee.on('e', spy.onEvent);

    ee.emit('e', 1);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(3);
  }

  @Test()
  async preserveOrder() {
    const ee = new EE();

    const results: string[] = [];

    ee.on('e1', arg => results.push(`e1-${arg}`));
    ee.once('e1', arg => results.push(`e1-${arg}`));
    ee.on('e2', arg => results.push(`e2-${arg}`));
    ee.on('e3', arg => results.push(`e3-${arg}`));

    ee.emit('e1', 1); // caught twice
    ee.emit('e2', 2);
    ee.event('e3', 3); // async
    ee.emit('e1', 4);
    ee.emit('e2', 5);

    Expect(results).toEqual(['e1-1', 'e1-1', 'e2-2', 'e1-4', 'e2-5']);

    await new Promise(resolve => setTimeout(resolve, 100));

    Expect(results).toEqual(['e1-1', 'e1-1', 'e2-2', 'e1-4', 'e2-5', 'e3-3']);
  }

  @Test()
  voidArg() {
    const ee = new EE<Events>();

    const results: number[] = [];

    ee.on('e', arg => results.push(arg));
    ee.once('e', arg => results.push(arg));

    ee.emit('e', 1); // collected twice
    ee.event('e', 2);

    Expect(results).toEqual([1, 1]);
  }

  @Test()
  subclass() {
    const Sub = class <T> extends EE<T> {
      trigger<E extends keyof T>(e: E, ...arg: OptArg<T[E]>) {
        return this.emit(e, ...arg);
      }
    };

    const ee = new Sub<Events>();

    const results: unknown[] = [];

    ee.on('e', arg => results.push(arg));
    ee.on('f', arg => results.push(arg));
    ee.on('g', arg => results.push(arg));

    ee.emit('e', 1);

    ee.trigger('f', 'a').emit('g');

    Expect(results).toEqual([1, 'a', undefined]);
  }

  @Test()
  untypedEmitter() {
    const ee = new EE();

    const results: unknown[] = [];

    ee.on('e', arg => results.push(arg));
    ee.on('f', arg => results.push(arg));
    ee.on('g', arg => results.push(arg));
    ee.on('h', arg => results.push(arg));
    ee.on('i', arg => results.push(arg));
    ee.on(1,   arg => results.push(arg));

    ee.emit('e', 1);
    ee.emit('f', 'a');
    ee.emit('g');
    ee.emit('h', [1, 2]);
    ee.emit('i', { a: 'a', b: 1 });
    ee.emit(1, 'a');

    Expect(results).toEqual([1, 'a', undefined, [1, 2], { a: 'a', b: 1 }, 'a']);
  }

  @Test()
  typedEmitter() {
    const ee = new EE<Events>();

    const results: unknown[] = [];

    ee.on('e', arg => results.push(arg));
    ee.on('f', arg => results.push(arg));
    ee.on('g', arg => results.push(arg));
    ee.on('h', arg => results.push(arg));
    ee.on('i', arg => results.push(arg));
    ee.on(1,   arg => results.push(arg));

    ee.emit('e', 1);
    ee.emit('f', 'a');
    ee.emit('g');
    ee.emit('h', [1, 2]);
    ee.emit('i', { a: 'a', b: 1 });
    ee.emit(1, 'a');

    Expect(results).toEqual([1, 'a', undefined, [1, 2], { a: 'a', b: 1 }, 'a']);
  }

  @Test()
  indexedEmitter() {
    const ee = new EE<AnyEvents>();

    const results: unknown[] = [];

    ee.on('a', arg => results.push(arg));
    ee.on('b', arg => results.push(arg));

    ee.emit('a', 1);
    ee.emit('b', 'a');

    Expect(results).toEqual([1, 'a']);
  }
}
