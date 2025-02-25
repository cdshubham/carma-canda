import { auth } from "@/auth";
import { cache } from "react";

export const getSessionDetail = cache(async () => {
  const session = await auth();
  return session;
});
