import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const order = await baseApi.get("/order/getLatestOrder", {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        order: order.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}