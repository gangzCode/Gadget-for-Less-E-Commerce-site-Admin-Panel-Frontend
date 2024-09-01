import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // const session = await getIronSession(req, res, {
    //     password: IRON_SESSION_SECRET,
    //     cookieName: IRON_SESSION_COOKIE
    // });
    // await session.destroy();
    cookies().delete("user");
    return Response.json({ success: true, message: "OK" });
  } catch (e) {
    console.error("Error destroying session", e);
    return Response.json({
      success: false,
      message: "An error occurred while destroying session",
    });
  }
}
