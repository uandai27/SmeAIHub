declare module "hellosign-embedded" {
  type OpenOptions = {
    clientId: string;
    skipDomainVerification?: boolean;
    testMode?: boolean;
  };

  export default class HelloSign {
    constructor(options?: { clientId?: string });
    on(event: "cancel" | "close" | "error" | "finish" | "open", callback: () => void): void;
    open(url: string, options: OpenOptions): void;
  }
}
