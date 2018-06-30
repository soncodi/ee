import { TestFixture, Test, AsyncTest, SpyOn, Expect } from 'alsatian';
import { EE } from '../src';

@TestFixture()
export class EETests {
  @Test()
  simpleEvent() {
    const ee = new EE();

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

    ee.emit('e', 5);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(2);
  }

  @Test()
  removeHandler() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);
    ee.off('e', spy.onEvent);

    ee.emit('e', 5);

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

    ee.emit('e', 5);

    Expect(spy.onEvent).toHaveBeenCalled().exactly(1);
  }

  @Test()
  onceHandler() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.once('e', spy.onEvent);

    ee.emit('e', 5);
    ee.emit('e', 5);

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

    ee.emit('e', 5);

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

    ee.emit('e', 5);

    Expect(spy.onEvent).not.toHaveBeenCalled();
  }

  @AsyncTest()
  async asyncEvent() {
    const ee = new EE();

    const spy = { onEvent() { /**/ } };
    SpyOn(spy, 'onEvent');

    ee.on('e', spy.onEvent);

    ee.event('e', 5);

    Expect(spy.onEvent).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 100));

    Expect(spy.onEvent).toHaveBeenCalled();
  }
}
