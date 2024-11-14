const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  NestInstrumentation,
} = require("@opentelemetry/instrumentation-nestjs-core");

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [getNodeAutoInstrumentations(), new NestInstrumentation()],
});
