import { decodeProto, TYPES, typeToString } from "./protobufDecoder.js";
// import ProtobufDisplay from "./ProtobufDisplay";
import {
  decodeFixed32,
  decodeFixed64,
  decodeStringOrBytes,
  decodeVarintParts,
} from "./protobufPartDecoder.js";

function ProtobufVarintPart(value) {
  const decoded = decodeVarintParts(value);

  return decoded.map((d, i) => ({ key: i, type: d.type, value: d.value }));
}

function ProtobufStringOrBytesPart(value) {
  return value.value;
}

function ProtobufFixed64Part(value) {
  const decoded = decodeFixed64(value);

  return decoded.map((d, i) => ({ key: i, type: d.type, value: d.value }));
}

function ProtobufFixed32Part(value) {
  const decoded = decodeFixed32(value);

  return decoded.map((d, i) => ({ key: i, type: d.type, value: d.value }));
}

function getProtobufPart(part) {
  let decoded;
  switch (part.type) {
    case TYPES.VARINT:
      return [ProtobufVarintPart(part.value)];
    case TYPES.LENDELIM:
      // TODO: Support repeated field
      decoded = decodeProto(part.value);
      if (part.value.length > 0 && decoded.leftOver.length === 0) {
        const parts = decoded.parts.map((part, i) => {
          return ProtobufPart(part);
        });
        return [parts, "protobuf"];
      } else {
        decoded = decodeStringOrBytes(part.value);
        return [ProtobufStringOrBytesPart(decoded), decoded.type];
      }
    case TYPES.FIXED64:
      return [ProtobufFixed64Part(part.value)];
    case TYPES.FIXED32:
      return [ProtobufFixed32Part(part.value)];
    default:
      return ["Unknown type"];
  }
}

function ProtobufPart(part) {
  const [contents, subType] = getProtobufPart(part);
  const stringType = typeToString(part.type, subType);
  return {
    byteRange: part.byteRange.join("-"),
    fieldNum: part.index,
    type: stringType,
    content: contents,
  };
}

export default ProtobufPart;
