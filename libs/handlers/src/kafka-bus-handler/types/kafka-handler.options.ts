type KafkaMessageBusOperations = {
  CONNECT_OR_DISCONNECT: {
    topic?: never;
    message?: never;
  };
  PUBLISH_OR_SEND: {
    topic: string;
    message?: string;
  };
  SUBSCRIBE: {
    topic: string;
    message?: never;
  };
};

export type KafkaMessageBusOperationsOptions = {
  [K in keyof KafkaMessageBusOperations]: {
    operationType: K;
  } & KafkaMessageBusOperations[K];
}[keyof KafkaMessageBusOperations];
