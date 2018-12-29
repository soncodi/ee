import { TestFixture, Test, AsyncTest, SpyOn, Expect } from 'alsatian';
import { EE } from '../src';

@TestFixture()
export class EETests {
  @Test()
  simpleEvent() {
    const ee = new EE<number>();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.emit('e', 5);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
    Expect(spy.onEvent).toHaveBeenCalledWith(5);
  }

  @Test()
  sameHandlerMulti() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);

    ee.emit('e');

    Expect(spy.onEvent).toHaveBeenCalled().exactly(2);
  }

  @Test()
  removeHandler() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.off('e', spy.onEvent);

    ee.emit('e');

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeHandlerMulti() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);
    ee.off('e', spy.onEvent);

    ee.emit('e');

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
  }

  @Test()
  onceHandler() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.once('e', spy.onEvent);

    ee.emit('e');
    ee.emit('e');

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
  }

  @Test()
  removeSomeSubs() {
    const ee = new EE();

    const spy1 = { onEvent() { /**/ } };
    SpyOn(spy1, 'onEvent');

    const spy2 = { onEvent() { /**/ } };
    SpyOn(spy2, 'onEvent');

    ee.on('e', spy1.onEvent);
    ee.on('e', spy2.onEvent);
    ee.off('e', spy2.onEvent);

    ee.emit('e');

    Expect(spy1.onEvent).toHaveBeenCalled().exactly(1);
    Expect(spy2.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeAllSubs() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.on('e', spy.onEvent);
    ee.off('e');

    ee.emit('e');

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @AsyncTest()
  async asyncEvent() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.event('e');

    Expect(spy.onEvent).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 100));

    Expect(spy.onEvent).toHaveBeenCalled();
  }

  @Test()
  emitMissingEvent() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.emit('x');

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @Test()
  removeMissingEvent() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.off('x');

    ee.emit('e');

    Expect(spy.onEvent).toHaveBeenCalled();
  }

  @Test()
  onceHandlerMulti() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.once('e', spy.onEvent);
    ee.once('e', spy.onEvent);

    ee.on('e', spy.onEvent);

    ee.emit('e');

    Expect(spy.onEvent).toHaveBeenCalled().exactly(2);
  }

  @AsyncTest()
  async preserveOrder() {
    const ee = new EE<number>();

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
    const ee = new EE();

    const results: void[] = [];

    ee.on('e1', arg => results.push(arg));
    ee.once('e1', arg => results.push(arg));

    ee.emit('e1');
    ee.event('e1');

    Expect(results).toEqual([undefined, undefined]);
  }
}
