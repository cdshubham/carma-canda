import { auth } from "@/app/api/auth/auth";
import { cache } from "react";

export const getSessionDetail = cache(async () => {
  const session = await auth();
  return session;
});
