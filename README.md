# decode-protobuf

A javascript library for decoding `protobuf` messages without requiring the `.proto` file definitions. You get one big javascipt object to sort through.

It will **not**:

- create `.proto` file definitions
- work as a `protobuf` client in any manner

This is a "port" (the code is 99% the same) of the pertinent code from the [protobuf-decoder React project](https://github.com/pawitp/protobuf-decoder/) packaged for re-use.

## Installation

```bash
npm install decode-protobuf
```

## Usage

```javascript
const { decodeProtobuf } = require("decode-protobuf");

// Decode a binary protobuf message
const decoded = decodeProtobuf(binaryData);
console.log(decoded);
```

You can, for example, take a [got](https://github.com/sindresorhus/got) response body, feed it into `decodeProtobuf` and get an object.

## License

MIT
