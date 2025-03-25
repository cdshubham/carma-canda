import { jwtVerify, type JWTPayload } from 'jose';
import { NextRequest } from 'next/server';

export async function getDataFromToken(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) throw new Error("Token not found");

    // Use jose's jwtVerify to decode and verify the JWT
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.TOKEN_SECRET!));

    // Assuming the payload contains the 'id' field as a string, return it.
    return payload.id as string;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
