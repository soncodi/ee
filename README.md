# EE (Event Emitter)

[![Build Status](https://travis-ci.org/soncodi/ee.svg?branch=master)](https://travis-ci.org/soncodi/ee)
[![Coverage Status](https://coveralls.io/repos/github/soncodi/ee/badge.svg?branch=coverage)](https://coveralls.io/github/soncodi/ee?branch=coverage)
[![Dependency Status](https://david-dm.org/soncodi/ee/status.svg)](https://david-dm.org/soncodi/ee)
[![npm version](https://badge.fury.io/js/%40soncodi%2Fee.svg)](https://badge.fury.io/js/%40soncodi%2Fee)

**Tiny event emitter utility for Node.js and browsers**

### Installation

```sh
npm install @soncodi/ee --save
```

### Usage (TypeScript)

```typescript
import { EE } from '@soncodi/ee';

const ee = new EE<number>();

const handler = (param: number) => {
  console.log(`event fired ${param}`);
};

ee.on('event', handler);

ee.emit('event', 123);

ee.off('event', handler);
```

### Methods

#### `on(event: string, fn: (arg: T) => void): this`
Attaches an event handler to be called whenever the event fires.

#### `once(event: string, fn: (arg: T) => void): this`
Attaches a one-time handler which is unbound after it fires the first time.

#### `off(event: string, fn?: (arg: T) => void): this`
Detaches one instance of a given handler from the event emitter. If no handler is provided, detaches all handlers.

#### `emit(event: string, arg: T): this`
Fires the event synchronously, triggering any attached handlers with the given `arg`.

#### `event(event: string, arg: T): this`
Fires the event asynchronously, triggering any attached handlers with the given `arg`. Useful when attaching handlers later in the same event loop turn.
