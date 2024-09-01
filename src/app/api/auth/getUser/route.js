import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const userObj = {
        name: user.username,
        email: user.email,
        accessToken: user.accessToken,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        _id: user._id,
      };

      return Response.json({
        success: true,
        user: userObj,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
