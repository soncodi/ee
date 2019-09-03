# EE (Event Emitter)

[![Build Status](https://travis-ci.org/soncodi/ee.svg?branch=master)](https://travis-ci.org/soncodi/ee)
[![Coverage Status](https://coveralls.io/repos/github/soncodi/ee/badge.svg?branch=coverage)](https://coveralls.io/github/soncodi/ee?branch=coverage)
[![Dependency Status](https://david-dm.org/soncodi/ee/status.svg)](https://david-dm.org/soncodi/ee)
[![npm version](https://badge.fury.io/js/%40soncodi%2Fee.svg)](https://badge.fury.io/js/%40soncodi%2Fee)

**Tiny, typed event emitter utility for Node.js and browsers. No dependencies.**

_Need a single event and type, only? Check out [Signal](https://github.com/soncodi/signal) instead_

### Installation

```sh
npm install @soncodi/ee --save
```

### Usage (TypeScript)

```typescript
import { EE } from '@soncodi/ee';

// map event names to their callback param types
interface Events {
  a: number;
  b: string;
  c: undefined;
}

const ee = new EE<Events>();

const cb = (num: number) => console.log('A', num);

ee.on('a', cb);
ee.on('b', str => console.log('B', str));
ee.once('c', () => console.log('C'));

ee.emit('a', 123);
ee.emit('b', 'hello');
ee.emit('c');

ee.off('a', cb);

ee.event('b', 123); // error
ee.event('d', 123); // error
```

### Methods

#### `on(event, fn)`
Attaches an event handler to be called whenever the event fires.

#### `once(event, fn)`
Attaches a one-time handler which is unbound after it fires the first time.

#### `off(event, fn?)`
Detaches one instance of a given handler from the event emitter. If no handler is provided, detaches all handlers.

#### `emit(event, arg)`
Fires the event synchronously, triggering any attached handlers with the given `arg`.

#### `event(event, arg)`
Fires the event asynchronously, triggering any attached handlers with the given `arg`. Useful when attaching handlers later in the same event loop turn.
