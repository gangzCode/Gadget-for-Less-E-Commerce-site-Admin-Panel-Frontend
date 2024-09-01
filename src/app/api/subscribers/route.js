import { baseApi } from "@/utils/ApiCalls/ApiCalls";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);

      const subscribers = await baseApi.get("/news-letters/", {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({
        success: true,
        subscribers: subscribers.data,
      });
    } else {
      return Response.json({ success: false, message: "Failed" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}

export async function DELETE(request) {
  // const tax = await request.json();
  const searchParams = request.nextUrl.searchParams;
  const subscribersId = searchParams.get("id");
  console.log(subscribersId);
  const cookieStore = cookies();

  try {
    const usercookie = cookieStore.get("user");
    if (usercookie) {
      const user = JSON.parse(usercookie.value);
      const res = await baseApi.delete("/news-letters/" + subscribersId, {
        headers: { token: `Bearer ${user.accessToken}` },
      });

      return Response.json({ success: true, message: "Created" });
    }
    return Response.json({ success: false, message: "Failed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed" });
  }
}
