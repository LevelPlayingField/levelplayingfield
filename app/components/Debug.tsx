import type { PropsWithChildren } from "react";

export default process.env.NODE_ENV === "production"
  ? function Debug({ children }: PropsWithChildren<never>) {
      return <>{children}</>;
    }
  : function Debug() {
      return null;
    };
